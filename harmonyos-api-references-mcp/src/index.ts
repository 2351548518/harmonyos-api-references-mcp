#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getStore, readDoc, type DocMeta } from "./data.js";
import { search } from "./search.js";

const store = getStore();

const server = new McpServer({
  name: "harmonyos-api-references",
  version: "0.1.0",
});

const SEP = " / ";

/**
 * Normalize a category path for tolerant prefix matching: strip full/half-width
 * parenthetical qualifiers from each segment, e.g.
 * "媒体 / Media Kit（媒体服务）" -> "媒体 / Media Kit".
 * Lets users drill down without knowing the exact parenthetical suffix.
 */
function normPath(p: string): string {
  return p
    .split(SEP)
    .map((seg) => seg.replace(/[(（][^)）]*[)）]/g, "").trim())
    .join(SEP)
    .trim();
}

/* ------------------------------------------------------------------ *
 * Tool 1: search_api_references
 * ------------------------------------------------------------------ */
server.tool(
  "search_api_references",
  "检索鸿蒙 API 参考文档(Full-text search over 4495 HarmonyOS API reference docs). " +
    "用于查 API 精确接口定义、参数、返回值、枚举取值、错误码. 输入 API 名/模块/功能关键词(中英文均可, " +
    "如 'AVPlayer createVideoPlayer'、'@ohos.multimedia.audio AudioCapturer'、'Ability 启动模式 启动原因'). " +
    "返回最相关的 API 文档列表(含标题、分类路径). 拿到 docId 后用 get_api_reference 读全文.",
  {
    query: z.string().describe("检索关键词,API 名/模块/功能"),
    limit: z.number().int().positive().max(30).default(8).describe("返回条数,默认 8"),
  },
  async ({ query, limit }) => {
    const hits = search(store, query, limit);
    if (hits.length === 0) {
      return text(`未找到与 "${query}" 相关的 API 参考。可尝试更换关键词,或用 list_api_references_by_topic 浏览分类。`);
    }
    const lines = hits.map((h, i) => `${i + 1}. ${h.docId} — ${h.title}\n   路径: ${h.path}`);
    return text(
      `命中 ${hits.length} 篇(按相关度排序):\n\n${lines.join("\n\n")}\n\n` +
        `提示: 用 get_api_reference({name:"<docId>"}) 读全文.`
    );
  }
);

/* ------------------------------------------------------------------ *
 * Tool 2: get_api_reference
 * ------------------------------------------------------------------ */
server.tool(
  "get_api_reference",
  "读取指定 API 参考文档的完整 Markdown 正文(Read full markdown of an API reference by its docId/fileName). " +
    "docId 即文件名(不含 .md),如 js-apis-media-avplayer、js-apis-app-ability-ability.",
  {
    name: z.string().describe("文档标识 docId(即文件名,不含 .md)"),
  },
  async ({ name }) => {
    const body = readDoc(store.docsDir, name);
    if (body === null) {
      return text(`API 参考 "${name}" 不存在。请确认 docId,可通过 search_api_references 或 list_api_references_by_topic 获取。`);
    }
    return text(body);
  }
);

/* ------------------------------------------------------------------ *
 * Tool 3: list_api_references_by_topic (支持多级下钻)
 * ------------------------------------------------------------------ */
server.tool(
  "list_api_references_by_topic",
  "按分类路径浏览鸿蒙 API 参考(Browse API references by topic path, supports drilling down). " +
    "不传 topic 时返回所有顶级类及文档数; 传入 topic 时返回该路径下所有文档(支持前缀匹配下钻, " +
    "如 '应用框架' 返回该类全部, '应用框架 / Ability Kit（程序框架服务）' 进一步下钻). " +
    "顶级类: API参考概述、应用框架、系统、媒体、应用服务、图形、AI、公共基础能力、标准库.",
  {
    topic: z
      .string()
      .optional()
      .describe("分类路径(顶级或任意前缀)。省略则返回所有顶级类。"),
  },
  async ({ topic }) => {
    if (!topic) {
      const rows = [...store.topics.entries()]
        .map(([t, ids]) => ({ t, n: ids.length }))
        .sort((a, b) => b.n - a.n || a.t.localeCompare(b.t));
      return text(
        `共 ${store.topics.size} 个顶级类,${store.docs.size} 篇 API 参考:\n\n` +
          rows.map((r) => `- ${r.t} (${r.n})`).join("\n") +
          `\n\n用 list_api_references_by_topic({topic:"<类名>"}) 下钻查看该类下文档.`
      );
    }
    // Prefix match: path === topic OR path startsWith "topic / ".
    // Tolerant of parenthetical qualifiers (Media Kit（媒体服务） -> Media Kit),
    // so users can drill down without the exact parenthetical suffix.
    const prefix = topic.trim();
    const normPrefix = normPath(prefix);
    const matched: DocMeta[] = [];
    for (const meta of store.docs.values()) {
      if (meta.path === prefix || meta.path.startsWith(prefix + SEP)) {
        matched.push(meta);
      } else if (normPrefix && (normPath(meta.path) === normPrefix || normPath(meta.path).startsWith(normPrefix + SEP))) {
        matched.push(meta);
      }
    }
    if (matched.length === 0) {
      return text(
        `未找到路径 "${prefix}"。顶级类: ${[...store.topics.keys()].sort().join("、")}`
      );
    }
    matched.sort((a, b) => a.path.localeCompare(b.path));
    const rows = matched.map((m) => `- ${m.docId} — ${m.path}`);
    return text(`路径 "${prefix}" 下 ${matched.length} 篇:\n\n${rows.join("\n")}`);
  }
);

/* ------------------------------------------------------------------ */
function text(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[harmonyos-api-references-mcp] fatal:", err);
  process.exit(1);
});
