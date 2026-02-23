import { LevelConfig } from './GameConfig';

export interface TileData {
  tileId: number;
  petType: number;
  layer: number;
  blockedBy: number[];
}

/**
 * 根据关卡配置生成基础牌组数据。
 * 说明：这里仅提供算法骨架，便于直接迁移到 Cocos Creator 3.8.2 项目。
 */
export function generateTiles(level: LevelConfig): TileData[] {
  const tiles: TileData[] = [];
  const total = Math.max(3, level.totalTiles - (level.totalTiles % 3));

  // 先按“三张一组”分配宠物类型，确保理论上可消除。
  const groups = total / 3;
  const petPool: number[] = [];
  for (let i = 0; i < groups; i++) {
    const petType = (i % level.petTypes) + 1;
    petPool.push(petType, petType, petType);
  }

  // 简单洗牌（Fisher–Yates）
  for (let i = petPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [petPool[i], petPool[j]] = [petPool[j], petPool[i]];
  }

  // 分层，后续可替换为更复杂的模板布局。
  for (let i = 0; i < total; i++) {
    const layer = i % level.layers;
    tiles.push({
      tileId: i + 1,
      petType: petPool[i],
      layer,
      blockedBy: [],
    });
  }

  // 生成简化遮挡关系：高层覆盖低层相邻牌。
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j].layer > tiles[i].layer && Math.abs(j - i) <= level.layers) {
        tiles[i].blockedBy.push(tiles[j].tileId);
      }
    }
  }

  return tiles;
}
