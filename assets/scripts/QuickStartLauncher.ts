import {
  _decorator,
  Button,
  Color,
  Component,
  JsonAsset,
  Label,
  Layout,
  Node,
  resources,
  Size,
  Sprite,
  UITransform,
  Vec3,
  view,
} from 'cc';
import { GameController } from './core/GameController';
import { SimpleBoardUI } from './ui/SimpleBoardUI';

const { ccclass, property } = _decorator;

@ccclass('QuickStartLauncher')
export class QuickStartLauncher extends Component {
  @property({ tooltip: '测试用：初始关卡（1~60）。联调后请改回 1。' })
  public startLevelId = 1;

  protected onLoad(): void {
    const { width: stageW, height: stageH } = this.getStageSize();

    const gameRoot = new Node('GameRoot');
    this.node.addChild(gameRoot);
    const gameController = gameRoot.addComponent(GameController);

    const uiRoot = new Node('UIRoot');
    this.node.addChild(uiRoot);

    const titleFont = Math.round(stageW * 0.055);
    const infoFont = Math.round(stageW * 0.045);

    const statusLabel = this.createLabel('StatusLabel', new Vec3(0, stageH * 0.34, 0), '状态：加载中', stageW * 0.9, 72, titleFont);
    const levelLabel = this.createLabel('LevelLabel', new Vec3(-stageW * 0.28, stageH * 0.43, 0), `关卡 ${this.startLevelId}/60`, stageW * 0.42, 58, infoFont);
    const walletLabel = this.createLabel('WalletLabel', new Vec3(stageW * 0.28, stageH * 0.43, 0), '金币 0 | 星星 0', stageW * 0.42, 58, infoFont);
    const slotLabel = this.createLabel('SlotLabel', new Vec3(0, -stageH * 0.31, 0), '槽位（0）', stageW * 0.8, 60, infoFont);

    uiRoot.addChild(statusLabel);
    uiRoot.addChild(levelLabel);
    uiRoot.addChild(walletLabel);
    uiRoot.addChild(slotLabel);

    const slotContainer = new Node('SlotContainer');
    slotContainer.setPosition(new Vec3(0, -stageH * 0.39, 0));
    const slotTransform = slotContainer.addComponent(UITransform);
    slotTransform.setContentSize(stageW * 0.94, stageH * 0.11);
    const slotLayout = slotContainer.addComponent(Layout);
    slotLayout.type = Layout.Type.HORIZONTAL;
    slotLayout.resizeMode = Layout.ResizeMode.CONTAINER;
    slotLayout.spacingX = Math.max(6, Math.round(stageW * 0.01));
    slotLayout.paddingLeft = 8;
    slotLayout.paddingRight = 8;
    uiRoot.addChild(slotContainer);

    const tileContainer = new Node('TileContainer');
    tileContainer.setPosition(new Vec3(0, -stageH * 0.03, 0));
    const tileTransform = tileContainer.addComponent(UITransform);
    const tileAreaW = stageW * 0.96;
    const tileAreaH = stageH * 0.62;
    tileTransform.setContentSize(tileAreaW, tileAreaH);

    const spacing = Math.max(6, Math.round(stageW * 0.008));
    const padding = Math.max(6, Math.round(stageW * 0.008));
    const columns = 6;
    const cell = Math.floor((tileAreaW - padding * 2 - spacing * (columns - 1)) / columns);

    const layout = tileContainer.addComponent(Layout);
    layout.type = Layout.Type.GRID;
    layout.resizeMode = Layout.ResizeMode.CONTAINER;
    layout.cellSize = new Size(cell, cell);
    layout.spacingX = spacing;
    layout.spacingY = spacing;
    layout.paddingTop = padding;
    layout.paddingBottom = padding;
    layout.paddingLeft = padding;
    layout.paddingRight = padding;
    uiRoot.addChild(tileContainer);

    const buttonWidth = stageW * 0.38;
    const buttonHeight = stageH * 0.068;
    const nextButtonNode = this.createButton('NextLevelButton', new Vec3(stageW * 0.24, -stageH * 0.47, 0), '下一关', buttonWidth, buttonHeight);
    const restartButtonNode = this.createButton('RestartButton', new Vec3(-stageW * 0.24, -stageH * 0.47, 0), '重开本关', buttonWidth, buttonHeight);
    uiRoot.addChild(nextButtonNode);
    uiRoot.addChild(restartButtonNode);

    const losePanel = this.createLosePanel(stageW, stageH);
    uiRoot.addChild(losePanel.root);

    const simpleBoardUI = uiRoot.addComponent(SimpleBoardUI);
    simpleBoardUI.gameController = gameController;
    simpleBoardUI.tileContainer = tileContainer;
    simpleBoardUI.statusLabel = statusLabel.getComponent(Label);
    simpleBoardUI.levelLabel = levelLabel.getComponent(Label);
    simpleBoardUI.walletLabel = walletLabel.getComponent(Label);
    simpleBoardUI.slotLabel = slotLabel.getComponent(Label);
    simpleBoardUI.slotContainer = slotContainer;
    simpleBoardUI.nextLevelButton = nextButtonNode.getComponent(Button);
    simpleBoardUI.restartButton = restartButtonNode.getComponent(Button);
    simpleBoardUI.losePanel = losePanel.root;
    simpleBoardUI.loseTitleLabel = losePanel.title;
    simpleBoardUI.loseDescLabel = losePanel.desc;
    simpleBoardUI.loseRestartButton = losePanel.restartButton;
    simpleBoardUI.tileSize = Math.max(72, Math.min(138, cell));
    simpleBoardUI.slotItemSize = Math.max(56, Math.floor(simpleBoardUI.tileSize * 0.82));

    gameController.initializeWithData(
      {
        levels: [
          {
            id: 1,
            chapter: 1,
            petTypes: 6,
            totalTiles: 36,
            layers: 2,
            slotCapacity: 7,
            obstacleRate: 0,
            target: 'clear_all',
          },
        ],
      },
      this.startLevelId,
    );
    simpleBoardUI.setup();

    resources.load('config/levels', JsonAsset, (error, asset) => {
      if (error || !asset) {
        const label = statusLabel.getComponent(Label);
        if (label) {
          label.string = '状态：使用内置关卡（resources 配置加载失败）';
        }
        return;
      }

      gameController.initializeWithAsset(asset, this.startLevelId);
      simpleBoardUI.setup();
    });
  }

  private getStageSize(): Size {
    const transform = this.node.getComponent(UITransform);
    if (transform) {
      return transform.contentSize;
    }

    return view.getVisibleSize();
  }

  private createLosePanel(stageW: number, stageH: number): { root: Node; title: Label | null; desc: Label | null; restartButton: Button | null } {
    const root = new Node('LosePanel');
    root.active = false;

    const rootUI = root.addComponent(UITransform);
    rootUI.setContentSize(stageW, stageH);
    root.setPosition(new Vec3(0, 0, 0));

    const overlay = root.addComponent(Sprite);
    overlay.color = new Color(0, 0, 0, 220);

    const card = new Node('LoseCard');
    const cardUI = card.addComponent(UITransform);
    cardUI.setContentSize(stageW * 0.8, stageH * 0.32);
    card.setPosition(new Vec3(0, 0, 0));
    const cardBg = card.addComponent(Sprite);
    cardBg.color = new Color(255, 252, 246, 255);

    const titleNode = this.createLabel('LoseTitle', new Vec3(0, stageH * 0.07, 0), '闯关失败', stageW * 0.65, 86, Math.round(stageW * 0.085));
    const title = titleNode.getComponent(Label);
    if (title) {
      title.color = new Color(200, 34, 34, 255);
    }

    const descNode = this.createLabel('LoseDesc', new Vec3(0, stageH * 0.015, 0), '差一点就过了！', stageW * 0.68, 68, Math.round(stageW * 0.048));
    const desc = descNode.getComponent(Label);
    if (desc) {
      desc.color = new Color(48, 48, 48, 255);
    }

    const restartNode = this.createButton(
      'LoseRestartButton',
      new Vec3(0, -stageH * 0.08, 0),
      '立即重开，再冲一次',
      stageW * 0.52,
      stageH * 0.07,
      new Color(255, 122, 48, 255),
      new Color(255, 255, 255, 255),
    );
    const restartButton = restartNode.getComponent(Button);

    card.addChild(titleNode);
    card.addChild(descNode);
    card.addChild(restartNode);
    root.addChild(card);

    return { root, title, desc, restartButton };
  }

  private createLabel(name: string, position: Vec3, text: string, width: number, height: number, fontSize: number): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(width, height);
    node.setPosition(position);

    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = Math.max(18, Math.round(fontSize));
    label.lineHeight = Math.max(20, Math.round(fontSize * 1.15));
    label.color = new Color(255, 255, 255, 255);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;

    return node;
  }

  private createButton(
    name: string,
    position: Vec3,
    text: string,
    width: number,
    height: number,
    bgColor = new Color(219, 219, 219, 255),
    textColor = new Color(20, 20, 20, 255),
  ): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(width, height);
    node.setPosition(position);

    const sprite = node.addComponent(Sprite);
    sprite.color = bgColor;

    node.addComponent(Button);

    const labelNode = this.createLabel(`${name}Label`, new Vec3(0, 0, 0), text, width * 0.95, height * 0.8, Math.min(36, width * 0.1));
    const label = labelNode.getComponent(Label);
    if (label) {
      label.color = textColor;
    }
    node.addChild(labelNode);

    return node;
  }
}
