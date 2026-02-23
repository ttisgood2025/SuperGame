export interface LevelConfig {
  id: number;
  chapter: number;
  petTypes: number;
  totalTiles: number;
  layers: number;
  slotCapacity: number;
  obstacleRate: number;
  target: 'clear_all';
}

export interface TileData {
  tileId: number;
  petType: number;
  layer: number;
  blockedBy: number[];
}
