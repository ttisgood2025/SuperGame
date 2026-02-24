import { _decorator } from 'cc';

const { ccclass } = _decorator;

@ccclass('EconomyManager')
export class EconomyManager {
  private coins = 0;
  private stars = 0;

  public settleWin(levelId: number, comboCount: number): { coins: number; stars: number } {
    const baseCoins = 20 + levelId * 3;
    const comboBonus = comboCount * 2;
    const levelStars = comboCount >= 5 ? 3 : comboCount >= 2 ? 2 : 1;

    this.coins += baseCoins + comboBonus;
    this.stars += levelStars;

    return { coins: baseCoins + comboBonus, stars: levelStars };
  }

  public getWallet(): { coins: number; stars: number } {
    return {
      coins: this.coins,
      stars: this.stars,
    };
  }
}
