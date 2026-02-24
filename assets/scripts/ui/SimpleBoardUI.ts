import {
  _decorator,
  Button,
  Color,
  Component,
  instantiate,
  Label,
  Layout,
  Node,
  Prefab,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
} from 'cc';
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

  @property({ tooltip: '宠物图标资源前缀，最终路径示例：resources/sprites/pets/pet_1.png -> sprites/pets/pet_1' })
  public petIconPathPrefix = 'sprites/pets/pet_';

  @property({ tooltip: '卡牌渲染尺寸（像素）' })
  public tileSize = 72;

  @property(Node)
  public losePanel: Node | null = null;

  @property(Label)
  public loseTitleLabel: Label | null = null;

  @property(Label)
  public loseDescLabel: Label | null = null;

  @property(Button)
  public loseRestartButton: Button | null = null;

  private subscribed = false;
  private autoNextScheduled = false;
  private iconCache = new Map<number, SpriteFrame | null>();
  private uiBound = false;

  protected start(): void {
    this.bindIfPossible();
    this.bindUiEvents();
    this.refresh();
  }

  protected onDestroy(): void {
    this.unbindUiEvents();

    if (this.subscribed && this.gameController) {
      this.gameController.offChanged(this.refresh, this);
    }
  }

  public setup(): void {
    this.bindIfPossible();
    this.bindUiEvents();
    this.refresh();
  }

  private bindIfPossible(): void {
    if (!this.subscribed && this.gameController) {
      this.gameController.onChanged(this.refresh, this);
      this.subscribed = true;
    }
  }

  private bindUiEvents(): void {
    if (this.uiBound) {
      return;
    }

    this.nextLevelButton?.node.on(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.on(Button.EventType.CLICK, this.onRestartLevel, this);
    this.loseRestartButton?.node.on(Button.EventType.CLICK, this.onRestartLevel, this);
    this.uiBound = true;
  }

  private unbindUiEvents(): void {
    if (!this.uiBound) {
      return;
    }

    this.nextLevelButton?.node.off(Button.EventType.CLICK, this.onNextLevel, this);
    this.restartButton?.node.off(Button.EventType.CLICK, this.onRestartLevel, this);
    this.loseRestartButton?.node.off(Button.EventType.CLICK, this.onRestartLevel, this);
    this.uiBound = false;
  }

  private onNextLevel(): void {
    this.gameController?.startNextLevel();
  }

  private onRestartLevel(): void {
    this.losePanel && (this.losePanel.active = false);
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
      const suffix = state === 'win' && levelId < maxLevelId ? '（即将自动进入下一关）' : '';
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

    this.updateLosePanel(state, levelId);

    if (state === 'win' && levelId < maxLevelId) {
      this.scheduleAutoNext();
    } else {
      this.autoNextScheduled = false;
    }

    this.renderTiles(this.gameController.getClickableTiles());
  }

  private updateLosePanel(state: string, levelId: number): void {
    const isLose = state === 'lose';
    if (this.losePanel) {
      this.losePanel.active = isLose;
    }

    if (this.loseTitleLabel) {
      this.loseTitleLabel.string = isLose ? '闯关失败' : '';
    }

    if (this.loseDescLabel) {
      this.loseDescLabel.string = isLose ? `第 ${levelId} 关差一点就过了！\n立即重开，再冲一次！` : '';
    }
  }

  private scheduleAutoNext(): void {
    if (this.autoNextScheduled) {
      return;
    }

    this.autoNextScheduled = true;
    this.scheduleOnce(() => {
      if (this.gameController?.getState() === 'win') {
        this.gameController.startNextLevel();
      }
      this.autoNextScheduled = false;
    }, 0.6);
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
      this.normalizeTileNode(item);
      this.applyTileVisual(item, tile);

      const button = item.getComponent(Button);
      if (button) {
        button.node.on(Button.EventType.CLICK, () => {
          this.gameController?.pickTile(tile.tileId);
        });
      }

      this.tileContainer?.addChild(item);
    });
  }

  private normalizeTileNode(item: Node): void {
    let itemTransform = item.getComponent(UITransform);
    if (!itemTransform) {
      itemTransform = item.addComponent(UITransform);
    }
    itemTransform.setContentSize(this.tileSize, this.tileSize);

    const label = item.getComponentInChildren(Label);
    const labelNode = label?.node;
    if (labelNode) {
      let labelTransform = labelNode.getComponent(UITransform);
      if (!labelTransform) {
        labelTransform = labelNode.addComponent(UITransform);
      }
      labelTransform.setContentSize(this.tileSize, this.tileSize);
    }
  }

  private applyTileVisual(item: Node, tile: TileData): void {
    const label = item.getComponentInChildren(Label);
    if (label) {
      label.string = `${tile.petType}`;
      label.color = new Color(35, 35, 35, 255);
    }

    const sprite = item.getComponent(Sprite);
    if (!sprite) {
      return;
    }

    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const cached = this.iconCache.get(tile.petType);
    if (cached !== undefined) {
      if (cached) {
        sprite.spriteFrame = cached;
        label && (label.string = '');
      }
      return;
    }

    const tryPaths = [
      `${this.petIconPathPrefix}${tile.petType}`,
      `${this.petIconPathPrefix}${tile.petType}/spriteFrame`,
    ];

    this.tryLoadSpriteFrame(tryPaths, 0, (frame) => {
      this.iconCache.set(tile.petType, frame);
      if (!frame) {
        return;
      }

      if (item.isValid) {
        const dynamicSprite = item.getComponent(Sprite);
        if (dynamicSprite) {
          dynamicSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          dynamicSprite.spriteFrame = frame;
        }
        const dynamicLabel = item.getComponentInChildren(Label);
        dynamicLabel && (dynamicLabel.string = '');
      }
    });
  }

  private tryLoadSpriteFrame(paths: string[], index: number, done: (frame: SpriteFrame | null) => void): void {
    if (index >= paths.length) {
      done(null);
      return;
    }

    resources.load(paths[index], SpriteFrame, (error, frame) => {
      if (error || !frame) {
        this.tryLoadSpriteFrame(paths, index + 1, done);
        return;
      }

      done(frame);
    });
  }

  private createDefaultTileItem(): Node {
    const node = new Node('TileItem');
    const ui = node.addComponent(UITransform);
    ui.setContentSize(this.tileSize, this.tileSize);

    const sprite = node.addComponent(Sprite);
    sprite.color = new Color(245, 234, 199, 255);

    node.addComponent(Button);

    const labelNode = new Node('Label');
    const labelUi = labelNode.addComponent(UITransform);
    labelUi.setContentSize(this.tileSize, this.tileSize);
    const label = labelNode.addComponent(Label);
    label.fontSize = 28;
    label.lineHeight = 32;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    node.addChild(labelNode);

    return node;
  }
}
