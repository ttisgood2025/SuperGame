import { _decorator, JsonAsset } from 'cc';
import { LevelConfig } from '../../../src/GameConfig';

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
    const payload = this.levelsAsset?.json as LevelsPayload | undefined;
    this.levels = payload?.levels ?? [];
  }

  public getLevel(levelId: number): LevelConfig {
    const level = this.levels.find((item) => item.id === levelId);
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }

    return level;
  }

  public getAllLevels(): LevelConfig[] {
    return this.levels;
  }
}
