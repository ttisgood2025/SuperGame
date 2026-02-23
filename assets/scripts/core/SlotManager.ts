import { _decorator } from 'cc';

const { ccclass } = _decorator;

@ccclass('SlotManager')
export class SlotManager {
  private slotCapacity = 7;
  private slots: number[] = [];

  public setup(capacity: number): void {
    this.slotCapacity = capacity;
    this.slots = [];
  }

  public push(petType: number): { removed: number[]; overflow: boolean } {
    this.slots.push(petType);

    const sameType = this.slots.filter((slot) => slot === petType);
    if (sameType.length >= 3) {
      let removeCount = 3;
      const nextSlots: number[] = [];
      for (const slot of this.slots) {
        if (slot === petType && removeCount > 0) {
          removeCount -= 1;
          continue;
        }
        nextSlots.push(slot);
      }
      this.slots = nextSlots;
      return { removed: [petType, petType, petType], overflow: false };
    }

    return { removed: [], overflow: this.slots.length > this.slotCapacity };
  }

  public snapshot(): number[] {
    return [...this.slots];
  }
}
