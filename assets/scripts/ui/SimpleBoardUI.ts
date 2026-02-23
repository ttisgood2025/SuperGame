import { _decorator, Button, Color, Component, EventTouch, instantiate, Label, Layout, Node, Prefab, Sprite, UITransform } from 'cc';
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

  private subscribed = false;

  protected onLoad(): void {
    this.nextLevelButton?.node.on(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.on(Button.EventType.CLICK, this.onRestartLevel, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTapAnywhere, this);
  }

  protected start(): void {
    this.bindIfPossible();
    this.refresh();
  }

  protected onDestroy(): void {
    this.nextLevelButton?.node.off(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.off(Button.EventType.CLICK, this.onRestartLevel, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTapAnywhere, this);

    if (this.subscribed && this.gameController) {
      this.gameController.offChanged(this.refresh, this);
    }
  }

  public setup(): void {
    this.bindIfPossible();
    this.refresh();
  }

  private bindIfPossible(): void {
    if (!this.subscribed && this.gameController) {
      this.gameController.onChanged(this.refresh, this);
      this.subscribed = true;
    }
  }

  private onNextLevel(): void {
    this.gameController?.startNextLevel();
  }

  private onRestartLevel(): void {
    this.gameController?.restartLevel();
  }

  private onTapAnywhere(_event: EventTouch): void {
    if (this.gameController?.getState() === 'win') {
      this.gameController.startNextLevel();
    }
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
      const suffix = state === 'win' && levelId < maxLevelId ? '（点击任意处或按钮进入下一关）' : '';
      this.statusLabel.string = `状态：${state} | 剩余牌：${this.gameController.getRemainingTileCount()}${suffix}`;
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

    if (this.nextLevelButton) {
      const canNext = state === 'win' && levelId < maxLevelId;
      this.nextLevelButton.interactable = canNext;
      this.nextLevelButton.node.active = canNext;
    }

    this.renderTiles(this.gameController.getClickableTiles());
  }

  private renderTiles(tiles: TileData[]): void {
    if (!this.tileContainer) {
      return;
    }

    this.tileContainer.removeAllChildren();

    const layout = this.tileContainer.getComponent(Layout);
    if (layout) {
      layout.updateLayout();
    }

    tiles.slice(0, 24).forEach((tile) => {
      const item = this.tilePrefab ? instantiate(this.tilePrefab) : this.createDefaultTileItem();
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

  private createDefaultTileItem(): Node {
    const node = new Node('TileItem');
    const ui = node.addComponent(UITransform);
    ui.setContentSize(72, 72);

    const sprite = node.addComponent(Sprite);
    sprite.color = new Color(245, 234, 199, 255);

    node.addComponent(Button);

    const labelNode = new Node('Label');
    const labelUi = labelNode.addComponent(UITransform);
    labelUi.setContentSize(72, 72);
    const label = labelNode.addComponent(Label);
    label.fontSize = 28;
    label.lineHeight = 32;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    node.addChild(labelNode);

    return node;
  }
}
