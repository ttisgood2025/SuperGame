import { _decorator, JsonAsset } from 'cc';
import { LevelConfig } from './GameTypes';

const { ccclass, property } = _decorator;

interface LevelsPayload {
  levels: LevelConfig[];
}

@ccclass('LevelManager')
export class LevelManager {
  @property({ type: JsonAsset })
  public levelsAsset: JsonAsset | null = null;

  private levels: LevelConfig[] = [];

  public init(): void {
    if (!this.levelsAsset) {
      this.levels = [];
      return;
    }

    this.loadFromData(this.levelsAsset.json as LevelsPayload);
  }

  public loadFromData(payload: LevelsPayload): void {
    this.levels = payload?.levels ?? [];
  }

  public getLevel(levelId: number): LevelConfig {
    const level = this.levels.find((item) => item.id === levelId);
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }

    return level;
  }

  public hasLevel(levelId: number): boolean {
    return this.levels.some((item) => item.id === levelId);
  }

  public getMaxLevelId(): number {
    return this.levels.length;
  }

  public getAllLevels(): LevelConfig[] {
    return this.levels;
  }
}
