import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HUDTips')
export class HUDTips extends Component {
  @property(Label)
  public messageLabel: Label | null = null;

  public show(message: string): void {
    if (this.messageLabel) {
      this.messageLabel.string = message;
    }
  }
}
