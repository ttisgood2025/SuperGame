import { _decorator, Component, EventTarget, JsonAsset } from 'cc';
import { BoardManager } from './BoardManager';
import { SlotManager } from './SlotManager';
import { EconomyManager } from './EconomyManager';
import { LevelManager } from './LevelManager';
import { LevelConfig, TileData } from './GameTypes';

const { ccclass, property } = _decorator;

type GameState = 'ready' | 'playing' | 'win' | 'lose';

@ccclass('GameController')
export class GameController extends Component {
  @property({ type: JsonAsset })
  public levelsAsset: JsonAsset | null = null;

  private state: GameState = 'ready';
  private currentLevelId = 1;
  private comboCount = 0;
  private initialized = false;

  private boardManager = new BoardManager();
  private slotManager = new SlotManager();
  private economyManager = new EconomyManager();
  private levelManager = new LevelManager();
  private eventTarget = new EventTarget();

  protected onLoad(): void {
    if (this.levelsAsset) {
      this.initializeWithAsset(this.levelsAsset, 1);
    }
  }

  public initializeWithAsset(levelsAsset: JsonAsset, startLevelId = 1): void {
    this.levelsAsset = levelsAsset;
    this.initializeWithData(levelsAsset.json as { levels: LevelConfig[] }, startLevelId);
  }

  public initializeWithData(payload: { levels: LevelConfig[] }, startLevelId = 1): void {
    this.levelManager.loadFromData(payload);
    this.initialized = this.levelManager.getMaxLevelId() > 0;

    if (!this.initialized) {
      this.state = 'ready';
      this.emitChanged();
      return;
    }

    const resolvedLevelId = this.resolveStartLevel(startLevelId);
    this.startLevel(resolvedLevelId);
  }

  public onChanged(callback: () => void, target?: unknown): void {
    this.eventTarget.on('changed', callback, target);
  }

  public offChanged(callback: () => void, target?: unknown): void {
    this.eventTarget.off('changed', callback, target);
  }

  public startLevel(levelId: number): void {
    if (!this.initialized) {
      return;
    }

    const level = this.levelManager.getLevel(levelId);
    this.currentLevelId = levelId;
    this.comboCount = 0;
    this.state = 'playing';

    this.boardManager.build(level);
    this.slotManager.setup(level.slotCapacity);
    this.emitChanged();
  }

  public restartLevel(): void {
    this.startLevel(this.currentLevelId);
  }

  public startNextLevel(): void {
    const nextLevelId = this.currentLevelId + 1;
    if (this.levelManager.hasLevel(nextLevelId)) {
      this.startLevel(nextLevelId);
    }
  }

  public pickTile(tileId: number): void {
    if (this.state !== 'playing') return;

    const tile = this.boardManager.pick(tileId);
    const result = this.slotManager.push(tile.petType);
    if (result.removed.length > 0) {
      this.comboCount += 1;
    }

    if (result.overflow) {
      this.state = 'lose';
      this.emitChanged();
      return;
    }

    if (this.boardManager.isClear()) {
      this.state = 'win';
      this.economyManager.settleWin(this.currentLevelId, this.comboCount);
      this.emitChanged();
      return;
    }

    this.emitChanged();
  }

  public getState(): GameState {
    return this.state;
  }

  public getCurrentLevelId(): number {
    return this.currentLevelId;
  }

  public getMaxLevelId(): number {
    return this.levelManager.getMaxLevelId();
  }

  public getClickableTiles(): TileData[] {
    return this.boardManager.getClickableTiles();
  }

  public getRemainingTileCount(): number {
    return this.boardManager.getAllTiles().length;
  }

  public getSlotSnapshot(): number[] {
    return this.slotManager.snapshot();
  }

  public getWallet(): { coins: number; stars: number } {
    return this.economyManager.getWallet();
  }

  private resolveStartLevel(startLevelId: number): number {
    if (this.levelManager.hasLevel(startLevelId)) {
      return startLevelId;
    }

    const firstLevel = this.levelManager.getAllLevels()[0];
    return firstLevel?.id ?? 1;
  }

  private emitChanged(): void {
    this.eventTarget.emit('changed');
  }
}
