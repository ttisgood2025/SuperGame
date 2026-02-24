import { LevelConfig, TileData } from './GameTypes';

/**
 * 根据关卡配置生成基础牌组数据。
 * 该文件位于 assets/scripts 内，确保“仅复制 assets 到 Cocos 项目”也可正常解析。
 */
export function generateTiles(level: LevelConfig): TileData[] {
  const tiles: TileData[] = [];
  const total = Math.max(3, level.totalTiles - (level.totalTiles % 3));

  const groups = total / 3;
  const petPool: number[] = [];
  for (let i = 0; i < groups; i++) {
    const petType = (i % level.petTypes) + 1;
    petPool.push(petType, petType, petType);
  }

  for (let i = petPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [petPool[i], petPool[j]] = [petPool[j], petPool[i]];
  }

  for (let i = 0; i < total; i++) {
    const layer = i % level.layers;
    tiles.push({
      tileId: i + 1,
      petType: petPool[i],
      layer,
      blockedBy: [],
    });
  }

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j].layer > tiles[i].layer && Math.abs(j - i) <= level.layers) {
        tiles[i].blockedBy.push(tiles[j].tileId);
      }
    }
  }

  return tiles;
}
