# flutter-code-standards-skills

一个面向本地 Flutter 项目的 Skill 包。用户入口始终是 `flutter-code-standards`，其余 skill 作为 companion skill 由入口 skill 按任务类型路由加载。

## 仓库结构

```text
skills/
  flutter-code-standards/              入口 skill，负责路由
  flutter-code-standards-structure/    结构、拆分、复杂度控制
  flutter-code-standards-api/          回调参数、页面/弹窗 API、返回值
  flutter-code-standards-content/      命名、常量、注释、UTF-8 中文
  flutter-code-standards-viewmodel/    Widget 顺序、ViewModel 分层、生命周期
  flutter-code-standards-safety/       测试边界、Figma 切图落盘、实现风险
```

## 技能职责

### `flutter-code-standards`

- 唯一用户入口。
- 只做总原则说明和 companion skill 路由。
- 不重复承载全部细则。

### `flutter-code-standards-structure`

- 负责结构健康检查、文件拆分、复杂度控制。
- 负责“避免过度设计”的判定标准。

### `flutter-code-standards-api`

- 负责组件回调参数、对外 API、页面/弹窗入口方法和返回值规范。
- 负责 ViewModel 透传边界。

### `flutter-code-standards-content`

- 负责命名、常量、注释、UTF-8 中文文本规范。
- 负责避免无意义超长命名和一次性常量滥抽。

### `flutter-code-standards-viewmodel`

- 负责 Widget 内部成员顺序。
- 负责 ViewModel 分层、生命周期职责和页面状态归属。

### `flutter-code-standards-safety`

- 负责测试边界，避免为了测试入侵生产代码。
- 负责 Figma 切图落盘与 MD5 去重规则。
- 负责实现前后的风险提醒。

## 安装方式

GitHub 上展示的安装方式以“复制 `skills/` 下的 skill 目录到本机技能目录”为准。

### PowerShell

```powershell
git clone https://github.com/ChenChen-Engine/flutter-code-standards-skills.git

$target = if ($env:CODEX_HOME) {
  Join-Path $env:CODEX_HOME 'skills'
} else {
  Join-Path $env:USERPROFILE '.agents/skills'
}

New-Item -ItemType Directory -Force $target | Out-Null
Copy-Item -Recurse -Force '.\flutter-code-standards-skills\skills\*' $target
```

### Bash

```bash
git clone https://github.com/ChenChen-Engine/flutter-code-standards-skills.git

target="${CODEX_HOME:-$HOME/.agents}/skills"
mkdir -p "$target"
cp -R ./flutter-code-standards-skills/skills/* "$target"/
```

## 修改原则

- 入口 skill `flutter-code-standards` 保持轻量，只负责路由、总原则和加载规则。
- 新规则先放进最小相关 companion skill，不要什么都堆回入口 skill。
- 避免在多个 companion skill 中重复写同一条规则；如果必须重复，说明原因并确保表述完全一致。
- 项目私有规则留在这个包里，不要回写到通用 skill。
- 规则增长时，先按职责边界拆分，再按文件大小拆分。
- companion skill 默认是包内模块，不是新的用户入口。除非确定有独立复用价值，否则不要再对外扩散新的入口名。

## 修改注意事项

- 改动路由时，同时更新 `flutter-code-standards/SKILL.md` 和本 README。
- 改动 skill 名称时，同时更新目录名、`SKILL.md` frontmatter、`agents/openai.yaml`、README 安装说明和入口路由链接。
- 改动 `agents/openai.yaml` 时，保持 `default_prompt` 仍然显式提到对应 skill 名。
- 新增 companion skill 时，优先保持 `policy.allow_implicit_invocation: false`，避免它绕过入口 skill 成为默认触发入口。
- 提交前至少运行一次 skill 校验，确认 frontmatter、命名和 `openai.yaml` 仍然有效。

## 推荐校验

```powershell
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards-structure
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards-api
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards-content
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards-viewmodel
python C:/Users/chenz/.codex/skills/.system/skill-creator/scripts/quick_validate.py .\skills\flutter-code-standards-safety
```
