---
name: flutter-code-standards-api
description: Use when flutter-code-standards routes a Flutter task here for callback parameters, widget APIs, page or dialog entry methods, or route return-value rules in this project.
---

# Flutter API Standards

这是 `flutter-code-standards` 的 companion skill。只在入口 skill 路由到这里，或用户明确要求这一类 API 规范时使用。

## 函数参数与回调

组件对外 API 优先使用明确的函数类型参数，把交互意图结构化表达出来，但不要为了“类型更优雅”滥用自定义 `typealias`。

- 无参数点击：使用 `VoidCallback`。
- 值变更：使用 `ValueChanged<T>` 或 `ValueSetter<T>`。
- 异步单值回调：优先直接写 `Future<void> Function(T value)`；项目已在用 `AsyncValueSetter<T>` 时可保持一致。
- 构建插槽：使用 `WidgetBuilder`、`IndexedWidgetBuilder`、`TransitionBuilder` 等 Flutter 现成类型。
- 多参数、跨文件复用或在当前模块频繁出现的复杂回调：再定义语义化 `typealias`。
- 如果函数类型只在单处使用、参数也不多，直接写在参数列表里，不额外定义 `typealias`。

禁止随意使用裸 `Function`、`dynamic Function` 或含义不清的 `void Function(...)`。只有项目既有 API 要求或 Flutter 框架接口要求时，才保留这种写法。

## ViewModel 透传边界

ViewModel 不允许作为参数传递给子 Widget、页面或弹窗。

- 需要让子组件触发行为时，传递明确的函数类型参数。
- 需要展示数据时，传递必要的数据字段、状态快照或项目既有状态监听对象。
- 不要为了省参数把整个 ViewModel 暴露给下层 UI。

## 页面和弹窗入口

- 页面和弹窗必须提供静态跳转方法，由该方法决定具体如何跳转。
- 页面统一提供 `enter` 方法，弹窗统一提供 `show` 方法。
- 调用处只关注输入参数和 `Future` 返回结果，不直接关心内部使用 `Navigator.push`、`showDialog`、`showModalBottomSheet` 还是项目路由封装。

静态跳转方法必须返回 `Future`：

- 没有业务返回值时返回 `Future<void>`。
- 有业务返回值时返回 `Future<T?>`，并让调用方通过 `await` 获取结果。

不要在调用处直接散落 `Navigator.push`、`showDialog` 或路由构造细节；这些跳转细节应收敛到页面的 `enter` 或弹窗的 `show` 中。

## 返回值优先级

1. 已有合适的数据类时，直接返回该数据类。
2. 返回值字段较少但比较零散时，优先返回 `Map<String, dynamic>`。
3. 使用 `Map` 时，key 必须优先来自 `modules/module_common/lib/consts/params_key.dart`。
4. 如果 `params_key.dart` 不存在、没有合适 key，或返回值字段较多、嵌套明显、语义复杂，新建语义化的 `XxxResult` 类。

不要用多个松散的回调模拟页面或弹窗结果。页面关闭、弹窗关闭、保存完成、选择完成等跨页面结果，应通过 `Future` 结果表达。
