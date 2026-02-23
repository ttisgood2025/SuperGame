# 萌宠三叠消消乐（Cocos Creator 3.8.2）

这是一个针对 **Cocos Creator 3.8.2** 的三叠消除类小游戏项目骨架，主题为萌宠 2D 风格，共 60 关，关卡型推进，并包含可持续游玩的上瘾循环机制。

## 你可以直接得到什么
- 一个可运行的基础玩法循环：点击牌面 -> 入槽 -> 三消 -> 胜负判定 -> 下一关/重开。
- 60 关 JSON 配置（可调参）。
- 一套“最少手工”的场景启动器 `QuickStartLauncher`。

## 已补全目录
- `assets/scripts/QuickStartLauncher.ts`：一键搭建运行时场景（最少人工配置）。
- `assets/scripts/core/`：核心玩法逻辑（关卡、牌堆、槽位、结算等）。
- `assets/scripts/ui/SimpleBoardUI.ts`：动态渲染牌面与 HUD。
- `assets/resources/config/levels.json`：可直接被 Cocos `JsonAsset` 加载的关卡配置。
- `assets/resources/theme/pet-theme.json`：萌宠主题配置。
- `assets/resources/i18n/zh-CN.json`：中文文案配置。
- `docs/setup-cocos.md`：最简接入指南。

## 快速接入 Cocos Creator 3.8.2（最少操作）
1. 在 Cocos Creator 3.8.2 新建 2D 项目。
2. 将本仓库 `assets/` 内容拷贝进项目。
3. 选中主场景 `Canvas`，挂载 `QuickStartLauncher`。
4. 点击运行（无需再手动拖拽绑定 `GameController` 和 UI 字段）。
## 核心卖点
- **三叠消除 + 轻策略**：玩家点击上层宠物卡牌，卡牌进入底部槽位，凑齐 3 张同图案即消除。
- **60 关关卡推进**：分为 4 个章节，难度递增，包含障碍、限步、目标类型变化。
- **上瘾循环机制**：短局（1-3 分钟）→ 奖励反馈 → 轻成长（皮肤、家园装饰）→ 再挑战。
- **萌宠 2D 美术风格**：猫、狗、兔、熊猫等宠物头像，圆角、柔色、高反馈特效。



## 开发检查命令
- `python -m json.tool config/levels.json >/dev/null`
- `python -m json.tool assets/resources/config/levels.json >/dev/null`

## 说明
- `src/` 目录是仓库内参考实现；实际在 Cocos 里运行只依赖 `assets/`。


## 开发复盘与标准化指南
- `docs/standardized-dev-guide.md`：从 0 到当前可运行状态的最简 SOP、踩坑复盘与排障清单。


## 关卡测试技巧
- 可在 `Canvas` 的 `QuickStartLauncher.startLevelId` 设置起始关（例如 `60`），回归测试后请改回 `1`。
