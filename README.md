# HarmonyOS API 参考 MCP 知识库

把华为鸿蒙(HarmonyOS)API 参考文档(4495 篇,`@ohos.*` 模块精确接口定义)封装成 MCP 检索服务,供 Claude Code / opencode / Cursor / Cline 等 AI 编程客户端在开发时调用——**调用某接口前,先检索 API 参考确认精确签名、参数、枚举、错误码,避免凭记忆编造参数名/取值**。

## 这是什么

| 组成 | 内容 | 分发方式 |
|------|------|---------|
| **① MCP 服务器** | 检索引擎,3 个工具:API 全文检索 / 读 API 参考 / 按分类路径浏览 | npm 包(`npx` 即用) |
| **② Skill** | 引导 AI"查接口定义先检索 API 参考"的流程说明 | 复制到 skills 目录 |
| **数据源** | 4495 篇 API 参考文档 + `index_log.txt`(分类) + `INDEX.md`(目录树) | 文档随包 |

与姊妹项目分工互补:

| | 本项目(api-references) | guides | best-practices | ui-design-guides |
|---|---|---|---|---|
| 查什么 | **接口精确定义**(参数/枚举/错误码) | **API 用法、调用流程** | **场景最佳实践 + 参考代码** | **设计怎么做**(视觉/交互/控件设计规范) |
| 数据 | 4495 篇 API 参考 | 5489 篇指南 | 452 篇 + 186 代码仓库 | 166 篇设计指南 |
| 适用 | "AudioCapturer 方法签名""state 枚举取值" | "AVPlayer 怎么初始化" | "长列表丢帧优化""组件复用范例" | "底部页签设计规范""暗色模式色彩" |

四者并列:api-references 查精确签名、guides 讲 API 用法、best-practices 给场景实践与参考代码、ui-design-guides 定设计规范。

## 四者并列使用(opencode 示例)

```json
{
  "mcp": {
    "harmonyos-best-practices": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-best-practices-mcp"],
      "environment": { "BP_CODE_DIR": "/abs/path/to/best_practices_code" }
    },
    "harmonyos-guides": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-guides-mcp"]
    },
    "harmonyos-api-references": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-api-references-mcp"]
    },
    "harmonyos-ui-design-guides": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-ui-design-guides-mcp"]
    }
  }
}
```

> **`BP_CODE_DIR`(仅 best-practices 可选)**:指向本地 `best_practices_code/` 目录(从 GitHub Release 下载 `harmonyos-best-practices-code.tar.gz` 解压得到)。配置后 `get_code_example` 会返回本地仓库路径与入口 `.ets` 文件,AI 可直接读取真实官方示例代码;**不配则只返回 gitcode 远程 URL**。Windows 路径用正斜杠更稳(如 `C:/path/to/best_practices_code`)。其余三个 MCP 是纯文档,无需此变量。

搭配各自的 Skill(`harmonyos-best-practices` / `harmonyos-guides` / `harmonyos-api-references` / `harmonyos-ui-design-guides`),AI 可据需求选用:guides 查 API 用法、best-practices 查场景实践与参考代码、api-references 查精确签名、ui-design-guides 查设计规范。

## 快速开始

### 1. 装 MCP 服务器

无需 clone 本仓库。客户端配置(以 Claude Code / opencode 为例):

```json
{
  "mcpServers": {
    "harmonyos-api-references": {
      "command": "npx",
      "args": ["-y", "harmonyos-api-references-mcp"]
    }
  }
}
```

> 包名以实际发布为准。任何支持 stdio 的 MCP 客户端同样配置。

### 2. 装 Skill

将 `skills/harmonyos-api-references/SKILL.md` 复制到 Claude Code 的 skills 目录(如 `~/.claude/skills/`)。这让 AI 在查鸿蒙接口定义时自动走"先检索 API 参考"的流程。

## 三个 MCP 工具

| 工具 | 作用 |
|------|------|
| `search_api_references({query, limit?})` | 全文检索 API 参考文档(中文友好),返回相关度排序的文档列表(含标题、分类路径) |
| `get_api_reference({name})` | 读取指定 API 参考(docId)的完整 Markdown 正文 |
| `list_api_references_by_topic({topic?})` | 按分类路径浏览;支持多级下钻(如 `媒体` → `媒体 / Audio Kit`) |

数据规模:4495 篇 API 参考,9 个顶级类——应用框架(1700)、系统(1042)、媒体(650)、应用服务(552)、图形(346)、AI(113)、公共基础能力(48)、标准库(41)、API参考概述(3)。

## 工作流程(开发时)

```
用户:"AudioCapturer 有哪些方法? state 枚举取值?"
   │
   ▼  Skill 触发
search_api_references("@ohos.multimedia.audio AudioCapturer")
   │  → 命中 js-apis-audiocapturer 等(含分类路径)
   ▼
get_api_reference("js-apis-audiocapturer")   ← 读精确方法签名、参数、枚举、错误码
   │
   ▼
依据精确定义编码(参数名/枚举值以参考为准,不凭记忆编造)
```

## 更新

API 参考和服务器会持续更新。

**更新服务器**:`npx -y` 自动拉新版,或 `npm update -g harmonyos-api-references-mcp`。更新后**重启 AI 客户端**。
**更新文档**:随包内置,更新包即更新。
**查看版本**:`npm view harmonyos-api-references-mcp version`。

## 目录结构

```
Harmonyos_Api_References_MCP/
├── harmonyos_api_references_docs/       # 数据源(4495 篇,不推 git)
│   ├── *.md                             # API 参考正文
│   └── index_log.txt                    # 分类(status / docId / 多级路径)
├── INDEX.md                             # 文档目录树(由 gen_index.mjs 生成)
├── gen_index.mjs                        # INDEX 生成脚本(index_log 更新后重跑)
│
├── harmonyos-api-references-mcp/        # ① MCP 服务器(npm 包)
│   ├── src/                             # TS 源码
│   ├── data/                            # 文档(prepack 拷入,随包)
│   ├── dist/                            # 编译产物
│   ├── scripts/
│   │   ├── copy-data.mjs                # prepack 拷数据
│   │   └── selfcheck.mjs                # 自检
│   └── README.md                        # MCP 详细文档
│
└── skills/harmonyos-api-references/     # ② Skill
    └── SKILL.md
```

## 维护者:开发与发布

详见 [`harmonyos-api-references-mcp/README.md`](harmonyos-api-references-mcp/README.md)。要点:

```bash
cd harmonyos-api-references-mcp
npm install
npm run build        # 编译
npm run prepack      # 拷数据到 data/ + 编译(发布前自动)
npm run selfcheck    # 自检三个工具
npm publish          # 发布到 npm
```

INDEX.md 重建(当 `index_log.txt` 更新后):

```bash
node gen_index.mjs
```

## 设计说明

- **为什么独立 MCP**:API 参考与指南(gudes)虽都是文档,但用途不同——参考是"接口字典"(精确签名/枚举/错误码),指南是"用法教程"。独立服务让 AI 能据需求选对检索源,各自的 Skill description 已刻意区分(本服务查"精确定义"、guides 查"用法"、best-practices 查"实践")。
- **多级分类路径**:API 参考的路径深(`应用框架 / Ability Kit / ArkTS API / Stage模型 / @ohos.app.ability.Ability`),`list_api_references_by_topic` 支持前缀下钻。
- **检索打分**:`5×title + 3×path + 3×headings + 1×正文(前200行)`,标题全文预提取,深节标题也能高权重命中。
- **文档随包**:4495 篇压缩后随 npm 包,装包即用、零配置。纯文档无代码,无需 Release 附件。

## 许可

API 参考文档源自华为 HarmonyOS 官方文档,版权归华为所有,此处仅作开发辅助检索用途。MCP 服务器代码(MIT)见 `harmonyos-api-references-mcp/package.json`。
