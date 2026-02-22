# Cocos Creator 3.8.2 接入步骤

1. 新建 2D 项目并打开资源管理器。
2. 拷贝目录到项目：
   - `assets/scripts/`
   - `assets/resources/config/levels.json`
   - `assets/resources/theme/pet-theme.json`
   - `assets/resources/i18n/zh-CN.json`
3. 创建主场景并挂载 `GameController`。
4. 将 `levels.json` 拖拽到 `GameController.levelsAsset`。
5. 创建卡牌预制体（PetTile）并接入点击事件，点击后调用 `pickTile(tileId)`。
6. 使用 `HUDTips` 显示胜负提示与连消提示。

> 建议：先接通“纯逻辑可玩版本”，再逐步替换美术、动画、音效与广告 SDK。
