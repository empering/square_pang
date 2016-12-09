import { PangItem } from './pang.item';

export class PnagItemContainer {
  private itemMap: Map<number, PangItem>;

  constructor() {
    this.itemMap = new Map<number, PangItem>();
  }

  addItem(itemKey: number, item: PangItem): void {
    this.itemMap.set(itemKey, item);
  }

  getItemByPoint(x: number, y: number): PangItem {
    let p = {x: x, y: y, conditionX: 'eq', conditionY: 'eq'};
    this.itemMap.forEach((item) => {
      if (this.testItemPointCondition(p, item)) {
        return item;
      }
    });
    return null;
  }

  getItemsByPoint(x: number, y: number, conditionX: string, conditionY: string): PangItem[] {
    let p = {x: x, y: y, conditionX: conditionX, conditionY: conditionY};
    let items: PangItem[];
    this.itemMap.forEach((item) => {
      if (this.testItemPointCondition(p, item)) {
        items.push(item);
      }
    });
    return items;
  }

  testItemPointCondition(p: {x: number, y: number, conditionX: string, conditionY: string}, item: PangItem): boolean {
    let itemX = item.getPointX();
    let itemY = item.getPointY();
    let conditionX = 1;
    let conditionY = 1;
    if (p.conditionX === 'gt') { conditionX = -1; }
    if (p.conditionY === 'gt') { conditionY = -1; }

    if (p.conditionX === 'eq' || p.conditionY === 'eq') {
      if (p.conditionX === 'eq' && itemX === p.x && itemY * conditionY < p.y * conditionY) {
        return true;
      } else if (p.conditionY === 'eq' && itemY === p.y && itemX * conditionX < p.x * conditionX) {
        return true;
      } else if (itemX === p.x && itemY === p.y) {
        return true;
      }
    } else {
      if (itemX * conditionX < p.x * conditionX && itemY * conditionY < p.y * conditionY) {
        return true;
      }
    }

    return false;
  }
}
