---
name: harmonyos-api-references
description: 查 HarmonyOS API 精确接口定义、参数、返回值、枚举取值、错误码时触发(如 "@ohos.multimedia.audio AudioCapturer 有哪些方法""AVPlayer 的 state 枚举取值""某接口返回的错误码含义""Ability 启动原因 LaunchType 取值")。对应 harmonyos-api-references-mcp 的 search_api_references / get_api_reference / list_api_references_by_topic 工具,检索 4495 篇 API 参考文档。注意:这是查"接口精确定义"(参数/枚举/错误码),若查 API 用法和示例请用 harmonyos-guides,查场景最佳实践和参考代码请用 harmonyos-best-practices,查设计规范用 harmonyos-ui-design-guides。
---

# 鸿蒙 API 参考 检索指引

本地有 4495 篇 HarmonyOS API 参考文档(`@ohos.*` 模块的精确接口定义),通过 `harmonyos-api-references` MCP 检索。**在为用户调用某鸿蒙接口前,若需确认其精确签名、参数、返回值、枚举取值或错误码,先检索 API 参考,不要凭记忆编造参数名/取值。**

## 何时用本 Skill(而非 guides / best-practices / ui-design-guides)

- ✅ 用本参考:查**接口精确定义**——方法签名、参数名/类型/必填、返回值、枚举的完整取值、错误码含义。例:"AudioCapturer 有哪些方法""AVPlayer state 枚举""startAbility 的参数""某错误码 16000001 什么意思"。
- ❌ 用 guides:查 API **怎么用、调用流程、示例代码**(开发指南)。
- ❌ 用 best-practices:查**场景最佳实践 + 参考代码**(怎么做最好)。
- ❌ 用 ui-design-guides:查**设计怎么做**(视觉/交互/控件设计规范)。
- 四者配合:guides 讲用法、本参考查精确签名、best-practices 给场景实践、ui-design-guides 定设计规范。

## 检索流程

1. **检索**:`search_api_references`,用 `API 名 / 模块 / 功能` 关键词(中英文均可,如 `AVPlayer createVideoPlayer`、`@ohos.multimedia.audio AudioCapturer`、`Ability 启动模式 启动原因`)。返回按相关度排序的 API 文档列表(含标题、分类路径)。

2. **读全文**:对最相关的命中调 `get_api_reference({name:"<docId>"})` 读完整 API 参考正文,确认方法签名、参数、枚举、错误码。

3. **依据定义编码**:接口名、参数、取值以参考正文为准,不凭记忆编造。枚举值、错误码必须查证后使用。

## 检索关键词指南(选对词,命中更准)

检索用 BM25 + CJK 权重 + 同义词扩展。关键词选择技巧:

- **`@ohos.*` 模块名最准**:API 参考按模块组织,用完整模块名命中目标接口文档。例:`@ohos.net.http`、`@ohos.data.relationalStore`、`@ohos.file.fs`、`@ohos.multimedia.camera`。
- **模块名 + 接口名**:缩小到具体接口。例:`@ohos.multimedia.media AVPlayer`、`@ohos.multimedia.audio AudioCapturer`、`@ohos.app.ability UIAbility`。
- **C API 用 capi- 前缀**:C/C++ 接口文档 docId 多为 `capi-xxx`。例:`AVRecorder 录制接口` → `capi-avrecorder`。
- **同义词已内置扩展**:弹窗↔dialog、列表↔list、按钮↔button 等自动 OR 扩展,用任一写法都能命中。
- **查不到时**:先 `list_api_references_by_topic` 看大类找 Kit,再下钻;或换 `@ohos.` 模块名重试。

## 大类清单(先定位,再下钻)

4495 篇 API 参考,9 个顶级类(括号为文档数):

API参考概述(3)、应用框架(1700)、系统(1042)、媒体(650)、应用服务(552)、图形(346)、AI(113)、公共基础能力(48)、标准库(41)。

用 `list_api_references_by_topic({topic:"<大类>"})` 下钻,支持多级路径前缀(如 `媒体 / Media Kit`,括号容错)。

## 辅助

- 不确定某 API 归哪个 Kit 时,用 `list_api_references_by_topic()` 看顶级类(API参考概述/应用框架/系统/媒体/应用服务/图形/AI/公共基础能力/标准库),再 `list_api_references_by_topic({topic:"媒体"})` 下钻,支持传完整路径前缀(如 `媒体 / Audio Kit`)进一步缩小。
- docId 即文件名(不含 .md),如 `js-apis-media-avplayer`、`js-apis-app-ability-ability`。
- API 参考的路径常含 `@ohos.xxx (中文说明)`,标题段即为接口名+说明。

## 反模式(避免)

- ❌ 不查参考就写接口调用,凭印象编造参数名/类型/枚举值——鸿蒙 API 枚举和参数名与 Web/Android 差异大,极易错。
- ❌ 把本参考当"用法教程"用——它只给精确定义,不讲为什么/怎么用(那看 guides)。
- ❌ 错误码靠猜——必须查 `errorcode-*` 文档确认含义。
