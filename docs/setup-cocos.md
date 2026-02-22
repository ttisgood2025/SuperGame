# Cocos Creator 3.8.2 接入步骤

1. 新建 2D 项目并打开资源管理器。
2. 拷贝目录到项目：
   - `assets/scripts/`
   - `assets/resources/config/levels.json`
   - `assets/resources/theme/pet-theme.json`
   - `assets/resources/i18n/zh-CN.json`
3. 创建 `Canvas`，在其下创建 `GameRoot` 节点并挂载 `GameController`。
4. 将 `assets/resources/config/levels.json` 拖拽到 `GameController.levelsAsset`。
5. 在 `Canvas` 下创建基础 UI：
   - `TileContainer`（建议加 `Layout` 组件用于网格排布）
   - `StatusLabel`、`LevelLabel`、`WalletLabel`、`SlotLabel`
   - `NextLevelButton`、`RestartButton`
   - `TileItem` 预制体（节点上至少有 `Button + Label`）
6. 在 `Canvas`（或单独 UI 节点）挂载 `SimpleBoardUI`，并绑定：
   - `gameController` -> `GameRoot/GameController`
   - `tileContainer` -> `TileContainer`
   - `tilePrefab` -> `TileItem`
   - 4 个 Label 与 2 个 Button 对应拖拽绑定
7. 运行后点击牌面数字可进行三消，通关后 `NextLevelButton` 会可点击。

> 你截图里的“黑底 + 少量按钮”通常是因为 UI 只做了静态按钮，还没有把 `SimpleBoardUI` 和 `TileContainer + TileItem` 绑定起来。
