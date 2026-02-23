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

const { ccclass } = _decorator;

@ccclass('QuickStartLauncher')
export class QuickStartLauncher extends Component {
  protected onLoad(): void {
    const gameRoot = new Node('GameRoot');
    this.node.addChild(gameRoot);
    const gameController = gameRoot.addComponent(GameController);

    const uiRoot = new Node('UIRoot');
    this.node.addChild(uiRoot);

    const statusLabel = this.createLabel('StatusLabel', new Vec3(0, 300, 0), '状态：加载中');
    const levelLabel = this.createLabel('LevelLabel', new Vec3(-260, 360, 0), '关卡 0/60');
    const walletLabel = this.createLabel('WalletLabel', new Vec3(230, 360, 0), '金币 0 | 星星 0');
    const slotLabel = this.createLabel('SlotLabel', new Vec3(0, -250, 0), '槽位：空');

    uiRoot.addChild(statusLabel);
    uiRoot.addChild(levelLabel);
    uiRoot.addChild(walletLabel);
    uiRoot.addChild(slotLabel);

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

    const nextButtonNode = this.createButton('NextLevelButton', new Vec3(210, -300, 0), '下一关');
    const restartButtonNode = this.createButton('RestartButton', new Vec3(-210, -300, 0), '重开本关');
    uiRoot.addChild(nextButtonNode);
    uiRoot.addChild(restartButtonNode);

    const simpleBoardUI = uiRoot.addComponent(SimpleBoardUI);
    simpleBoardUI.gameController = gameController;
    simpleBoardUI.tileContainer = tileContainer;
    simpleBoardUI.statusLabel = statusLabel.getComponent(Label);
    simpleBoardUI.levelLabel = levelLabel.getComponent(Label);
    simpleBoardUI.walletLabel = walletLabel.getComponent(Label);
    simpleBoardUI.slotLabel = slotLabel.getComponent(Label);
    simpleBoardUI.nextLevelButton = nextButtonNode.getComponent(Button);
    simpleBoardUI.restartButton = restartButtonNode.getComponent(Button);

    // 先使用兜底关卡，保证画面不会停在“加载中”。
    gameController.initializeWithData({
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
    });
    simpleBoardUI.setup();

    resources.load('config/levels', JsonAsset, (error, asset) => {
      if (error || !asset) {
        const label = statusLabel.getComponent(Label);
        if (label) {
          label.string = '状态：使用内置关卡（resources 配置加载失败）';
        }
        return;
      }

      gameController.initializeWithAsset(asset);
      simpleBoardUI.setup();
    });
  }

  private createLabel(name: string, position: Vec3, text: string): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(420, 40);
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

  private createButton(name: string, position: Vec3, text: string): Node {
    const node = new Node(name);
    const ui = node.addComponent(UITransform);
    ui.setContentSize(220, 72);
    node.setPosition(position);

    const sprite = node.addComponent(Sprite);
    sprite.color = new Color(219, 219, 219, 255);

    node.addComponent(Button);

    const labelNode = this.createLabel(`${name}Label`, new Vec3(0, 0, 0), text);
    const label = labelNode.getComponent(Label);
    if (label) {
      label.color = new Color(20, 20, 20, 255);
      label.fontSize = 30;
    }
    node.addChild(labelNode);

    return node;
  }
}
