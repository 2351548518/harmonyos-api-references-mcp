# HarmonyOS API 参考 MCP 服务器

把鸿蒙 API 参考文档(4495 篇,`@ohos.*` 模块精确接口定义)封装成 MCP 检索服务,供 Claude Code / opencode / Cursor / Cline 等客户端在开发时查接口签名、参数、枚举、错误码。**文档随包发布,装包即用、零配置。**

与姊妹项目分工:
- **本服务(api-references)**:查 API **精确接口定义**(参数、返回值、枚举取值、错误码)
- [`harmonyos-guides-mcp`](https://github.com/2351548518/harmonyos-guides-mcp):查 API **用法、调用流程、示例**(开发指南)
- [`harmonyos-best-practices-mcp`](https://github.com/2351548518/harmonyos-best-practices-mcp):查**场景最佳实践 + 参考代码**

三者可并列使用:guides 讲用法、本服务查精确签名、best-practices 给场景实践。

## 提供的工具

| 工具 | 作用 |
|------|------|
| `search_api_references({query, limit?})` | 全文检索 API 参考文档(中文友好),返回相关度排序的文档列表(含标题、分类路径) |
| `get_api_reference({name})` | 读取指定 API 参考(docId)的完整 Markdown 正文 |
| `list_api_references_by_topic({topic?})` | 按分类路径浏览;支持多级下钻(如 `媒体` → `媒体 / Audio Kit`) |

数据规模:4495 篇 API 参考,9 个顶级类——应用框架(1700)、系统(1042)、媒体(650)、应用服务(552)、图形(346)、AI(113)、公共基础能力(48)、标准库(41)、API参考概述(3)。

## 安装(最终用户)

无需 clone 本仓库,直接配置客户端(以 Claude Code / opencode `.mcp.json` 为例):

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

或全局安装:`npm install -g harmonyos-api-references-mcp`。任何支持 stdio 的 MCP 客户端同样配置。

### 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `BP_DOCS_DIR` | 包内 `data/docs` | 文档目录(一般无需改) |

## 更新

API 参考文档和服务器会持续更新(版本号见 `package.json`)。

**更新服务器**:

```bash
# npx -y 方式:无需手动操作,每次启动自动拉最新版
# 全局安装方式:手动更新
npm update -g harmonyos-api-references-mcp
# 或锁定最新版
npm install -g harmonyos-api-references-mcp@latest
```

更新后**重启 AI 客户端**(Claude Code / opencode / Cursor 等),让新进程加载新版 MCP。

**更新文档**:4495 篇 API 参考随包内置(`data/docs/`),更新 npm 包即同步更新,无需单独操作。纯文档,无代码包。

**查看版本**:
```bash
npm view harmonyos-api-references-mcp version   # 最新发布版
npm ls -g harmonyos-api-references-mcp          # 本地已装版本
```
或看客户端 MCP 面板里服务器的 `version` 字段。

## 开发与发布(维护者)

```bash
cd harmonyos-api-references-mcp
npm install
npm run build          # 编译
npm run prepack        # 拷文档到 data/ + 编译(发布前自动)
npm run selfcheck      # 自检三个工具
npm publish
```

包内含:`dist/` + `data/`(文档+索引) + README。源码 `src/` 不随包。

## 验证

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## 许可

API 参考文档源自华为 HarmonyOS 官方文档,版权归华为所有,此处仅作开发辅助检索用途。MCP 服务器代码(MIT)见 `package.json`。
