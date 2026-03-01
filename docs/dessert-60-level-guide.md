# 甜品主题抖音小游戏：60 关关卡包（可直接使用）

本文件提供一套可直接落地的 60 关参数方案，对应资源文件：

- `config/levels-dessert.json`
- `assets/resources/config/levels-dessert.json`

> 建议在 `QuickStartLauncher` 中把加载路径改为 `resources.load('config/levels-dessert', JsonAsset, ...)` 做甜品版本联调。

## 1) 设计目标

- 前 10 关：新手教学，低压、快反馈。
- 11~30 关：逐步提升密度与层数，建立“思考路径”。
- 31~50 关：强策略段，障碍与总牌量提升。
- 51~60 关：冲刺段，保持可过但明显需要规划槽位。

## 2) 字段含义

- `petTypes`：卡牌种类数（甜品种类+口味区分）。
- `totalTiles`：总牌数。
- `layers`：牌层数（遮挡复杂度）。
- `slotCapacity`：槽位容量（建议后段提升到 8）。
- `obstacleRate`：障碍占比（0~1）。
- `target`：当前统一 `clear_all`。

## 3) 章节难度曲线（每 10 关一章）

- Chapter 1（1~10）：`petTypes=6`，`layers=2`，`obstacleRate` 从 `0.00` 升至 `0.14`。
- Chapter 2（11~20）：`petTypes 6→7`，`layers 2→3`，`obstacleRate` 到 `0.17`。
- Chapter 3（21~30）：`petTypes=7`，`layers=3`，`obstacleRate` 到 `0.27`。
- Chapter 4（31~40）：`petTypes 7→8`，`layers 3→4`，`obstacleRate` 到 `0.39`。
- Chapter 5（41~50）：`petTypes=8`，`layers=4`，`slotCapacity` 后半章提至 `8`。
- Chapter 6（51~60）：`petTypes=8`，`layers 4→6`，`obstacleRate` 最高到 `0.61`。

## 4) 快速接入步骤

1. 保留当前项目默认 `levels.json` 不动。
2. 甜品版本测试时，把加载路径切到 `config/levels-dessert`。
3. 若要发布甜品版本，可将 `levels-dessert.json` 覆盖为正式 `levels.json`。

## 5) 关卡验证建议（最少）

- 新手段：1、5、10。
- 中段：20、30、40。
- 高压段：50、55、60。

通过标准：
- 不卡初始化；
- 可正常触发 win/lose；
- 第 60 关存在可过路径（非纯随机死局）。
