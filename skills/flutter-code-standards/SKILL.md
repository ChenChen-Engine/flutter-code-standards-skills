---
name: flutter-code-standards
description: Use when implementing Flutter pages, dialogs, complex widgets, or ViewModels in this project and you need the local standards package to route to the right companion skill.
---

# Flutter Code Standards

`flutter-code-standards` is the only entry skill in this package. Do not load every companion skill by default. Start with the smallest relevant companion skill set, then expand only when the task crosses boundaries.

## Entry Principles

- Follow the current file and project style unless the user explicitly asks for a refactor.
- Prefer direct, readable implementations over ceremonial abstractions.
- Use this package for project-local Flutter rules when they conflict with generic guidance.
- Treat companion skills in this package as internal modules. The user-facing entry remains `flutter-code-standards`.

## Routing

- 结构健康检查、文件拆分、复杂度控制、避免过度设计：读 [flutter-code-standards-structure](../flutter-code-standards-structure/SKILL.md)
- 回调参数、组件 API、页面/弹窗 `enter` `show`、返回值规范：读 [flutter-code-standards-api](../flutter-code-standards-api/SKILL.md)
- 命名、常量、注释、UTF-8 中文文本规范：读 [flutter-code-standards-content](../flutter-code-standards-content/SKILL.md)
- Widget 组织顺序、ViewModel 分层、生命周期职责：读 [flutter-code-standards-viewmodel](../flutter-code-standards-viewmodel/SKILL.md)
- 测试边界、Figma 切图落盘、实现风险提醒：读 [flutter-code-standards-safety](../flutter-code-standards-safety/SKILL.md)

## Companion Loading Rules

- 新建页面或弹窗：默认先读 `structure` 和 `viewmodel`，再按需要补 `api`、`content`、`safety`。
- 只改一个局部问题：只读和当前改动直接相关的 companion skill。
- Figma 驱动的 Flutter 资源落盘：至少读 `safety`，涉及命名或文案时再补 `content`。
- 不确定时先从 `structure` 开始；如果问题明显属于参数设计、文本规范或测试边界，再补其他 companion skill。

## Non-Goals

- 这个入口 skill 不重复抄写所有细则。
- 不要把 package 内的 companion skill 当成新的用户入口来介绍。
- 不要为了“保险”一次性加载全部 companion skill。
