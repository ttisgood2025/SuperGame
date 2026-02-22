# 萌宠三叠消消乐（Cocos Creator 3.8.2）

这是一个针对 **Cocos Creator 3.8.2** 的三叠消除类小游戏项目骨架，主题为萌宠 2D 风格，共 60 关，关卡型推进，并包含可持续游玩的上瘾循环机制。

## 核心卖点
- **三叠消除 + 轻策略**：玩家点击上层宠物卡牌，卡牌进入底部槽位，凑齐 3 张同图案即消除。
- **60 关关卡推进**：分为 4 个章节，难度递增，包含障碍、限步、目标类型变化。
- **上瘾循环机制**：短局（1-3 分钟）→ 奖励反馈 → 轻成长（皮肤、家园装饰）→ 再挑战。
- **萌宠 2D 美术风格**：猫、狗、兔、熊猫等宠物头像，圆角、柔色、高反馈特效。

## 已补全目录
- `docs/game-design.md`：完整玩法与系统设计。
- `docs/setup-cocos.md`：Cocos 3.8.2 接入步骤。
- `docs/content-plan.md`：内容与资源补全清单。
- `config/levels.json`：60 关配置源文件。
- `assets/resources/config/levels.json`：可直接被 Cocos `JsonAsset` 加载的关卡配置。
- `assets/resources/theme/pet-theme.json`：萌宠主题配置。
- `assets/resources/i18n/zh-CN.json`：中文文案配置。
- `src/`：仓库内的通用逻辑参考（可选，不是 Cocos 运行必需）。
- `assets/scripts/`：可挂载到 Cocos 场景的核心脚本骨架。

## 快速接入 Cocos Creator 3.8.2
1. 在 Cocos Creator 3.8.2 新建 2D 项目。
2. 将本仓库 `assets/` 内容拷贝进项目。
3. 在主场景挂载 `GameController`。
4. 把 `assets/resources/config/levels.json` 绑定到 `levelsAsset`。
5. 创建卡牌预制体与 UI（可参考 `docs/setup-cocos.md`）。

## 开发检查命令
- `python -m json.tool config/levels.json >/dev/null`
- `python -m json.tool assets/resources/config/levels.json >/dev/null`


## 已修复导入问题
- `assets/scripts/core` 现已自包含 `GameTypes.ts` 与 `LevelGenerator.ts`。
- 仅复制 `assets/` 到新建 Cocos 工程即可，不再依赖 `../../../src/*` 路径。
