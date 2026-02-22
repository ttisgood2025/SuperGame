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

export interface GameBalanceConfig {
  reviveExtraSlots: number;
  maxRevivePerLevel: number;
  comboScoreMultiplier: number[];
}

export const DEFAULT_BALANCE: GameBalanceConfig = {
  reviveExtraSlots: 2,
  maxRevivePerLevel: 1,
  comboScoreMultiplier: [1, 1.2, 1.5, 2],
};
