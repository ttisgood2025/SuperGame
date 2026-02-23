# Cocos Creator 3.8.2 最简接入（尽量少手工）

## A. 最少操作（推荐）
1. 新建 2D 项目。
2. 将本仓库 `assets/` 整体复制到项目根目录（覆盖同名目录）。
3. 打开主场景，选中 `Canvas` 节点。
4. 给 `Canvas` 挂载脚本：`QuickStartLauncher`。
5. 运行。

> `QuickStartLauncher` 会自动：
> - 创建 `GameController`
> - 自动加载 `resources/config/levels.json`
> - 自动生成基础 HUD、按钮、牌面容器
> - 自动绑定 `SimpleBoardUI`

## B. 如果你要自定义 UI（非最简）
你也可以不用 `QuickStartLauncher`，自己搭场景并挂 `GameController + SimpleBoardUI`。参考：
- `README.md` 的“快速接入”章节
- `assets/scripts/ui/SimpleBoardUI.ts` 字段说明

## C. 常见问题
- 运行后只看到黑底/几个静态按钮：说明还没把动态牌面逻辑绑定上。使用 A 方案可直接规避。
- 报 `levels` 加载失败：确认文件在 `assets/resources/config/levels.json`。

- 一直停在“状态：初始化中 / 槽位：空”：通常是旧脚本缓存。请删除项目 `temp/` 和 `library/` 后重开。

- 若显示“状态：使用内置关卡（resources 配置加载失败）”，代表 `assets/resources/config/levels.json` 未被正确导入，请在资源管理器确认它存在且类型为 JsonAsset。

- 通关后会自动进入下一关（约 0.6 秒），也可点击“下一关”按钮立即进入。

- 需要测试末关时：在 `Canvas -> QuickStartLauncher` 面板把 `startLevelId` 设置为 `60`；测试完成请改回 `1`。
