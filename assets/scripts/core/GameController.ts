import { _decorator, Component, JsonAsset } from 'cc';
import { BoardManager } from './BoardManager';
import { SlotManager } from './SlotManager';
import { EconomyManager } from './EconomyManager';
import { LevelManager } from './LevelManager';

const { ccclass, property } = _decorator;

type GameState = 'ready' | 'playing' | 'win' | 'lose';

@ccclass('GameController')
export class GameController extends Component {
  @property({ type: JsonAsset })
  public levelsAsset: JsonAsset | null = null;

  private state: GameState = 'ready';
  private currentLevelId = 1;
  private comboCount = 0;

  private boardManager = new BoardManager();
  private slotManager = new SlotManager();
  private economyManager = new EconomyManager();
  private levelManager = new LevelManager();

  protected onLoad(): void {
    this.levelManager.levelsAsset = this.levelsAsset;
    this.levelManager.init();
    this.startLevel(1);
  }

  public startLevel(levelId: number): void {
    const level = this.levelManager.getLevel(levelId);
    this.currentLevelId = levelId;
    this.comboCount = 0;
    this.state = 'playing';

    this.boardManager.build(level);
    this.slotManager.setup(level.slotCapacity);
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
      return;
    }

    if (this.boardManager.isClear()) {
      this.state = 'win';
      this.economyManager.settleWin(this.currentLevelId, this.comboCount);
    }
  }
}
