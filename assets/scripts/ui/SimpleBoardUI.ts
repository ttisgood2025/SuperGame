import { _decorator, Button, Component, instantiate, Label, Layout, Node, Prefab } from 'cc';
import { GameController } from '../core/GameController';
import { TileData } from '../core/GameTypes';

const { ccclass, property } = _decorator;

@ccclass('SimpleBoardUI')
export class SimpleBoardUI extends Component {
  @property(GameController)
  public gameController: GameController | null = null;

  @property(Node)
  public tileContainer: Node | null = null;

  @property(Prefab)
  public tilePrefab: Prefab | null = null;

  @property(Label)
  public statusLabel: Label | null = null;

  @property(Label)
  public levelLabel: Label | null = null;

  @property(Label)
  public walletLabel: Label | null = null;

  @property(Label)
  public slotLabel: Label | null = null;

  @property(Button)
  public nextLevelButton: Button | null = null;

  @property(Button)
  public restartButton: Button | null = null;

  protected onLoad(): void {
    this.nextLevelButton?.node.on(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.on(Button.EventType.CLICK, this.onRestartLevel, this);
    this.gameController?.onChanged(this.refresh, this);
    this.refresh();
  }

  protected onDestroy(): void {
    this.nextLevelButton?.node.off(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.off(Button.EventType.CLICK, this.onRestartLevel, this);
    this.gameController?.offChanged(this.refresh, this);
  }

  private onNextLevel(): void {
    this.gameController?.startNextLevel();
  }

  private onRestartLevel(): void {
    this.gameController?.restartLevel();
  }

  private refresh(): void {
    if (!this.gameController) {
      return;
    }

    const state = this.gameController.getState();
    const levelId = this.gameController.getCurrentLevelId();
    const maxLevelId = this.gameController.getMaxLevelId();
    const wallet = this.gameController.getWallet();
    const slots = this.gameController.getSlotSnapshot();

    if (this.statusLabel) {
      this.statusLabel.string = `状态：${state} | 剩余牌：${this.gameController.getRemainingTileCount()}`;
    }

    if (this.levelLabel) {
      this.levelLabel.string = `关卡 ${levelId}/${maxLevelId}`;
    }

    if (this.walletLabel) {
      this.walletLabel.string = `金币 ${wallet.coins} | 星星 ${wallet.stars}`;
    }

    if (this.slotLabel) {
      this.slotLabel.string = `槽位：${slots.join(' , ') || '空'}`;
    }

    this.nextLevelButton && (this.nextLevelButton.interactable = state === 'win' && levelId < maxLevelId);
    this.renderTiles(this.gameController.getClickableTiles());
  }

  private renderTiles(tiles: TileData[]): void {
    if (!this.tileContainer || !this.tilePrefab) {
      return;
    }

    this.tileContainer.removeAllChildren();

    const layout = this.tileContainer.getComponent(Layout);
    if (layout) {
      layout.updateLayout();
    }

    tiles.slice(0, 24).forEach((tile) => {
      const item = instantiate(this.tilePrefab);
      const label = item.getComponentInChildren(Label);
      if (label) {
        label.string = `${tile.petType}`;
      }

      const button = item.getComponent(Button);
      if (button) {
        button.node.on(Button.EventType.CLICK, () => {
          this.gameController?.pickTile(tile.tileId);
        });
      }

      this.tileContainer?.addChild(item);
    });
  }
}
