---
name: flutter-code-standards-viewmodel
description: Use when flutter-code-standards routes a Flutter task here for widget organization, ViewModel layering, lifecycle ownership, or page and dialog state boundaries in this project.
---

# Flutter ViewModel Standards

这是 `flutter-code-standards` 的 companion skill。只在入口 skill 路由到这里，或用户明确要求这一类 ViewModel 与分层规范时使用。

## Widget 结构顺序

一个 Widget 类内部按以下顺序组织：

1. 类声明。
2. 字段。
3. 构造函数。
4. 普通方法。
5. 非生命周期重写方法。
6. 生命周期方法，例如 `initState`、`didChangeDependencies`、`didUpdateWidget`、`dispose`。
7. 返回 Widget 的 `build` 辅助方法，例如 `_buildHeader`、`_buildContent`、`_buildActionBar`。
8. `build` 方法。

`build` 方法只负责组织页面目录，不承载复杂业务判断、请求、数据归并或大段条件分支。

## ViewModel 与分层

复杂页面或复杂弹窗必须引入 ViewModel 作为视图与数据的中间层：

- 页面负责布局、交互绑定和展示状态。
- ViewModel 负责状态、事件处理、数据转换、校验、加载、提交和错误归并。
- Repository 负责数据源、接口、本地缓存或持久化。
- Reducer、Subholder、Controller 等更细粒度结构按复杂度需要再拆。

没有明确要求一个页面或弹窗最多只能有几个 ViewModel，但多个 ViewModel 的分工必须合理。通常一个页面或弹窗一个 ViewModel 就够；只有存在清晰独立的复杂区域、子流程、长生命周期子模块或独立数据来源时，才拆出多个 ViewModel。多个 ViewModel 之间不得职责重叠，不得把简单字段拆成多个状态管理对象。

ViewModel 不直接依赖具体 Widget，不持有 `BuildContext` 做长期状态，不直接写 UI 细节。需要弹窗、Toast、导航等 UI 行为时，通过页面层响应状态或回调处理。

ViewModel 按需提供 `initState` 和 `dispose` 方法。初始化请求、订阅、计时器、控制器、缓存预热和默认状态归并尽可能放在 ViewModel 的 `initState` 中处理；取消订阅、释放控制器、关闭流、取消计时器和清理临时状态尽可能放在 ViewModel 的 `dispose` 中处理。页面或弹窗的生命周期方法只负责创建、调用和释放 ViewModel，不承载可下沉到 ViewModel 的业务初始化和资源释放逻辑。

ViewModel 也要避免过度设计。能在当前方法内直接看清的一次性简单逻辑可以就地保留；只有在复用、隔离副作用、明确语义边界或显著降低复杂度时，才继续拆方法或拆辅助对象。

## 最小示例

```dart
/// 展示用户资料编辑页面。
class UserProfileEditPage extends StatefulWidget {
  /// 当前编辑的用户 ID。
  final String userId;

  /// 创建用户资料编辑页面。
  const UserProfileEditPage({
    required this.userId,
    super.key,
  });

  /// 进入用户资料编辑页面。
  static Future<Map<String, dynamic>?> enter(
    BuildContext context, {
    required String userId,
  }) {
    return Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (context) => UserProfileEditPage(userId: userId),
      ),
    );
  }

  /// 创建页面状态。
  @override
  State<UserProfileEditPage> createState() => _UserProfileEditPageState();
}

/// 管理用户资料编辑页面的展示状态。
class _UserProfileEditPageState extends State<UserProfileEditPage> {
  /// 页面状态管理对象。
  late final UserProfileEditViewModel _viewModel;

  /// 初始化页面依赖。
  @override
  void initState() {
    super.initState();
    _viewModel = UserProfileEditViewModel(userId: widget.userId);
    _viewModel.initState();
  }

  /// 释放页面依赖。
  @override
  void dispose() {
    _viewModel.dispose();
    super.dispose();
  }

  /// 构建页面标题区域。
  Widget _buildHeader() {
    return const Text('编辑资料');
  }

  /// 构建页面主体内容。
  Widget _buildContent() {
    return const SizedBox.shrink();
  }

  /// 构建用户资料编辑页面。
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(),
        Expanded(child: _buildContent()),
      ],
    );
  }
}

/// 管理用户资料编辑页面的数据和业务状态。
class UserProfileEditViewModel {
  /// 当前编辑的用户 ID。
  final String userId;

  /// 创建用户资料编辑页面的数据和业务状态管理对象。
  UserProfileEditViewModel({
    required this.userId,
  });

  /// 初始化用户资料编辑页面的数据。
  void initState() {
    // 按需加载初始数据、订阅状态或准备控制器。
  }

  /// 释放用户资料编辑页面持有的资源。
  void dispose() {
    // 按需取消订阅、释放控制器或清理临时状态。
  }
}
```

示例只展示结构顺序。真实页面需要继续按项目架构补齐 ViewModel、状态监听、错误展示和测试。
