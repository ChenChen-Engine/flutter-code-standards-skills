---
name: flutter-code-standards-content
description: Use when flutter-code-standards routes a Flutter task here for naming, constants, comments, or UTF-8 Chinese text rules in this project.
---

# Flutter Content Standards

这是 `flutter-code-standards` 的 companion skill。只在入口 skill 路由到这里，或用户明确要求这一类文本与内容规范时使用。

## 命名

文件、类、方法、字段命名要精炼易懂。先保证含义清楚，再尽量缩短；不要把上下文里已经明显的信息重复堆进名字。

- 优先使用当前作用域下最短且不歧义的命名，不靠无意义前后缀把名字拉长。
- 不为了“统一格式”制造超长命名；例如能叫 `_buildHeader` 就不要写成 `_buildUserProfileEditPageHeaderWidget`。

## 常量

- `static const`、顶层常量和共享字段只在多处复用、具备明确业务语义、需要统一修改，或 Flutter API 明确要求时再抽取。
- UI 属性、文案、间距、圆角、颜色、标题等如果只在单处使用，直接写在使用处或写成局部 `const`；不要为一次性值额外声明类级 `static` 变量。
- 单次使用的字符串、标签和样式值，优先就地表达；只有跨组件复用或确有统一维护价值时，才抽常量。

## 注释规范

类、构造函数、方法、重写方法和生命周期方法必须写 Dart 文档注释。字段按需注释，以下字段必须注释：

- 业务含义复杂的字段。
- 缓存、节流、防抖、分页、选择状态、权限状态等状态字段。
- 与外部接口、路由参数、本地存储、埋点或兼容逻辑相关的字段。
- 容易被误删、误改或误解的字段。

注释要说明职责、约束和使用原因，不写空泛重复内容。中文注释必须直接写 UTF-8 中文。

## 中文与编码

所有中文语义内容都必须直接写 UTF-8 中文，包括：

- Dart 字符串、UI 文案、Toast 文案、Dialog 文案、Snackbar 文案。
- 日志、异常消息、测试描述、测试断言消息。
- 注释、文档、配置、JSON、ARB、本地化资源。
- Skill 文档和项目内辅助说明。

禁止用“反斜杠 u 加四位十六进制码位”这类 Unicode 转义表达中文。只有外部协议、序列化格式、第三方接口或自动生成文件强制要求转义时，才允许在边界层保留，并且不得扩散到业务代码和 UI 代码。

开发后必须扫描新增或修改内容：

```powershell
rg ('\\' + 'u[0-9a-fA-F]{4}')
```

如果命中的是中文转义，改成 UTF-8 中文；如果命中的是协议或生成文件要求，保留并说明原因。
