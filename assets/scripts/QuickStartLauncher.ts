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
} from 'cc';
import { GameController } from './core/GameController';
import { SimpleBoardUI } from './ui/SimpleBoardUI';

const { ccclass, property } = _decorator;

@ccclass('QuickStartLauncher')
export class QuickStartLauncher extends Component {
  @property({ tooltip: '测试用：初始关卡（1~60）。联调后请改回 1。' })
  public startLevelId = 1;

  protected onLoad(): void {
    const gameRoot = new Node('GameRoot');
    this.node.addChild(gameRoot);
    const gameController = gameRoot.addComponent(GameController);

    const uiRoot = new Node('UIRoot');
    this.node.addChild(uiRoot);

    const statusLabel = this.createLabel('StatusLabel', new Vec3(0, 300, 0), '状态：加载中');
    const levelLabel = this.createLabel('LevelLabel', new Vec3(-260, 360, 0), `关卡 ${this.startLevelId}/60`);
    const walletLabel = this.createLabel('WalletLabel', new Vec3(230, 360, 0), '金币 0 | 星星 0');
    const slotLabel = this.createLabel('SlotLabel', new Vec3(0, -220, 0), '槽位（0）');

    uiRoot.addChild(statusLabel);
    uiRoot.addChild(levelLabel);
    uiRoot.addChild(walletLabel);
    uiRoot.addChild(slotLabel);

    const slotContainer = new Node('SlotContainer');
    slotContainer.setPosition(new Vec3(0, -285, 0));
    const slotTransform = slotContainer.addComponent(UITransform);
    slotTransform.setContentSize(560, 80);
    const slotLayout = slotContainer.addComponent(Layout);
    slotLayout.type = Layout.Type.HORIZONTAL;
    slotLayout.resizeMode = Layout.ResizeMode.CONTAINER;
    slotLayout.spacingX = 8;
    slotLayout.paddingLeft = 8;
    slotLayout.paddingRight = 8;
    uiRoot.addChild(slotContainer);

    const tileContainer = new Node('TileContainer');
    tileContainer.setPosition(new Vec3(0, 40, 0));
    const tileTransform = tileContainer.addComponent(UITransform);
    tileTransform.setContentSize(620, 420);
    const layout = tileContainer.addComponent(Layout);
    layout.type = Layout.Type.GRID;
    layout.resizeMode = Layout.ResizeMode.CONTAINER;
    layout.cellSize = new Size(80, 80);
    layout.spacingX = 10;
    layout.spacingY = 10;
    layout.paddingTop = 8;
    layout.paddingBottom = 8;
    layout.paddingLeft = 8;
    layout.paddingRight = 8;
    uiRoot.addChild(tileContainer);

    const nextButtonNode = this.createButton('NextLevelButton', new Vec3(210, -360, 0), '下一关');
    const restartButtonNode = this.createButton('RestartButton', new Vec3(-210, -360, 0), '重开本关');
    uiRoot.addChild(nextButtonNode);
    uiRoot.addChild(restartButtonNode);

    const losePanel = this.createLosePanel();
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

  private createLosePanel(): { root: Node; title: Label | null; desc: Label | null; restartButton: Button | null } {
    const root = new Node('LosePanel');
    root.active = false;

    const rootUI = root.addComponent(UITransform);
    rootUI.setContentSize(1200, 2200);
    root.setPosition(new Vec3(0, 0, 0));

    const overlay = root.addComponent(Sprite);
    overlay.color = new Color(0, 0, 0, 210);

    const card = new Node('LoseCard');
    const cardUI = card.addComponent(UITransform);
    cardUI.setContentSize(620, 420);
    card.setPosition(new Vec3(0, 0, 0));
    const cardBg = card.addComponent(Sprite);
    cardBg.color = new Color(255, 252, 246, 255);

    const titleNode = this.createLabel('LoseTitle', new Vec3(0, 120, 0), '闯关失败');
    const title = titleNode.getComponent(Label);
    if (title) {
      title.fontSize = 60;
      title.lineHeight = 66;
      title.color = new Color(200, 34, 34, 255);
    }

    const descNode = this.createLabel('LoseDesc', new Vec3(0, 30, 0), '差一点就过了！');
    const desc = descNode.getComponent(Label);
    if (desc) {
      desc.fontSize = 32;
      desc.lineHeight = 40;
      desc.color = new Color(48, 48, 48, 255);
    }

    const restartNode = this.createButton(
      'LoseRestartButton',
      new Vec3(0, -120, 0),
      '立即重开，再冲一次',
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

  private createLabel(name: string, position: Vec3, text: string): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(520, 60);
    node.setPosition(position);

    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = 28;
    label.lineHeight = 32;
    label.color = new Color(255, 255, 255, 255);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;

    return node;
  }

  private createButton(
    name: string,
    position: Vec3,
    text: string,
    bgColor = new Color(219, 219, 219, 255),
    textColor = new Color(20, 20, 20, 255),
  ): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(320, 88);
    node.setPosition(position);

    const sprite = node.addComponent(Sprite);
    sprite.color = bgColor;

    node.addComponent(Button);

    const labelNode = this.createLabel(`${name}Label`, new Vec3(0, 0, 0), text);
    const label = labelNode.getComponent(Label);
    if (label) {
      label.color = textColor;
      label.fontSize = 28;
      label.lineHeight = 32;
    }
    node.addChild(labelNode);

    return node;
  }
}
