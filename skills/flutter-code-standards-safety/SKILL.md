---
name: flutter-code-standards-safety
description: Use when flutter-code-standards routes a Flutter task here for test-only code boundaries, Figma asset landing rules, or final implementation risk checks in this project.
---

# Flutter Safety Standards

这是 `flutter-code-standards` 的 companion skill。只在入口 skill 路由到这里，或用户明确要求这一类安全边界规范时使用。

## 测试边界

AI 生成或补充测试时，不允许为了测试方便入侵生产代码。

- 不新增仅供测试使用的公开方法、字段、分支、标记位、调试开关、假数据入口、`forTest` 参数或隐藏后门。
- 不为了让测试更好写而改动真实 UI 文案、页面结构、状态流职责或业务分层。
- 如果现有代码难测，优先优化依赖边界、状态分层和公开接口，让生产代码本身更合理，而不是专门为测试开洞。
- 只有当生产代码本来就存在设计问题，修正后也能改善真实业务可维护性时，才允许顺手重构，再补测试验证。

## Figma 切图落盘

如果当前任务使用 Figma 相关 skill，并且 Figma 返回了可下载的切图、图片、图标或 SVG 资源，落盘规则必须跟随当前代码所在项目类型：

- 当前代码位于 `project Type: package` 模块时，切图目标目录是项目根目录下的 `res/images/<packageName>/`。例如当前模块名是 `agent`，则目标目录是 `res/images/agent/`。
- 当前代码位于 `project Type: application` 时，切图目标目录是项目根目录下的 `res/images/`。
- 如果用户明确要求“强制下载到指定目录”，按用户要求执行，此时可以跳过 MD5 去重规则。

默认不要直接把切图下载到目标目录。标准流程如下：

1. 先把切图下载到本机回收站或等价的临时回收目录。
2. 计算下载文件的 MD5。
3. 遍历项目 `res/` 目录中的现有资源文件并比较 MD5。
4. 如果项目中已存在 MD5 相同的文件，直接复用该文件，不重复落盘，不制造同内容不同名的副本。
5. 只有在目标目录中不存在相同 MD5 文件时，才把临时下载文件移动到最终目录。

执行这条规则时还要注意：

- 去重优先按内容判断，不按文件名判断。文件名不同但 MD5 相同，也视为同一资源。
- 只有确认内容不同，才允许把新文件移动到 `res/images` 目标目录。
- 如果目标目录不存在，先按项目结构创建正确目录，再执行 MD5 比较和移动。
- 如果无法判断当前 `project Type`、项目根目录或模块名，先从当前代码位置向上定位项目结构后再下载，不要凭猜测落盘。

## 实现风险检查

实现时额外检查这些风险：

- AI 补测试时是否通过修改生产代码来给测试让路。
- Figma 切图是否先经回收站并完成 MD5 去重，而不是直接把重复资源落到 `res/`。
- 是否引入了只用一次的 `static` 常量、自定义回调 `typealias` 或状态对象，让阅读路径反而变长。
- 新增逻辑是否能被单元测试、Widget 测试或小范围手动验证覆盖。
