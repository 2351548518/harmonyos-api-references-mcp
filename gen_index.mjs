// 从 index_log.txt 生成 INDEX.md, 格式参考 Harmonyos_UI_Design_Guides_MCP/INDEX.md。
// 策略: 顶级类粗体; 展开到第 3 级(Kit 层); 第 4 级及更深的叶子文档平铺在其第 3 级祖先下。
// 用法: node gen_index.mjs  (当 index_log.txt 更新后重跑重建 INDEX.md)
import * as fs from "node:fs";
import * as path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
const root = here; // 脚本在项目根
const logFile = path.join(root, "index_log.txt");
const outFile = path.join(root, "INDEX.md");
const SEP = " / ";
const MAX_DEPTH = 3;

const lines = fs.readFileSync(logFile, "utf8").split(/\r?\n/);

const entries = [];
for (const raw of lines) {
  if (!raw.trim()) continue;
  const parts = raw.split("\t");
  if (parts.length < 3) continue;
  const docId = parts[1].trim();
  const fullPath = parts.slice(2).join("\t").trim();
  const segs = fullPath.split(SEP).map((s) => s.trim()).filter(Boolean);
  if (!segs.length) continue;
  entries.push({ docId, segs, title: segs[segs.length - 1] });
}

const tree = new Map();
function getNode(parentMap, name) {
  if (!parentMap.has(name)) parentMap.set(name, { name, children: new Map(), docs: [] });
  return parentMap.get(name);
}

for (const e of entries) {
  const [top, ...rest] = e.segs;
  const topNode = getNode(tree, top);
  if (rest.length === 0) { topNode.docs.push({ docId: e.docId, title: e.title }); continue; }
  let cur = topNode;
  const mid = rest.slice(0, MAX_DEPTH - 1);
  const leaf = rest.slice(MAX_DEPTH - 1);
  for (const seg of mid) cur = getNode(cur.children, seg);
  const leafTitle = leaf.length ? leaf[leaf.length - 1] : e.title;
  cur.docs.push({ docId: e.docId, title: leafTitle });
}

function countDocs(node) {
  let n = node.docs.length;
  for (const c of node.children.values()) n += countDocs(c);
  node._count = n;
  return n;
}
for (const node of tree.values()) countDocs(node);

const out = [];
out.push("# HarmonyOS API 参考文档索引 (api-references)");
out.push("");
out.push(`> 共 ${entries.length} 篇，目录 \`harmonyos_api_references_docs/\`。文件名即文档 slug（fileName）。`);
out.push("> 为控制篇幅，展开到第 3 级（Kit 层）；更深的 API 文档平铺在其 Kit 分类下。");
out.push("");

function renderNode(node, indent) {
  const pad = "  ".repeat(indent);
  const count = node._count;
  if (indent === 0) out.push(`${pad}- **${node.name}**  (${count} 篇)`);
  else out.push(`${pad}- ${node.name}  (${count} 篇)`);
  for (const c of node.children.values()) renderNode(c, indent + 1);
  for (const d of node.docs) out.push(`${pad}  - \`${d.docId}.md\` — ${d.title}`);
}
for (const node of tree.values()) renderNode(node, 0);

fs.writeFileSync(outFile, out.join("\n") + "\n", "utf8");
console.log(`已生成 ${outFile}`);
console.log(`总行数: ${out.length}, 文档数: ${entries.length}, 顶级类: ${tree.size}`);
