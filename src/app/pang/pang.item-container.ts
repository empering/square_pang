import { PangItem } from './pang.item';

export class PangItemContainer {
  // private itemMap: Map<number, PangItem>;
  private items: PangItem[];

  constructor() {
    // this.itemMap = new Map<number, PangItem>();
    this.items = new Array();
  }

  addItem(item: PangItem): void {
    // this.itemMap.set(itemKey, item);
    this.items.push(item);
  }

  addItems(itemsContainer: PangItemContainer): void {
    // this.items.concat(itemsContainer.getItems()); // ???
    itemsContainer.getItems().forEach((item) => {
      this.addItem(item);
    });
    this.sort();
  }

  sort(): void {
    this.items.sort((a, b) => {
      return a.getItemKey() - b.getItemKey();
    });
  }

  clear(): void {
    // this.itemMap.clear();
    this.items.splice(0);
  }

  destroy(): void {
    this.items.forEach((item) => {
      // console.log('destroy : ' + item.getItemType() + ' : ' + item.getPointX() + ' : ' + item.getPointY());
      item.getItemObj().destroy();
    });
    this.clear();
  }

  size(): number {
    return this.items.length;
  }

  removeItemByPoint(x: number, y: number): void {
    let p = { x: x, y: y, conditionX: 'eq', conditionY: 'eq' };
    let items = this.getItems();

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (this.testItemPointCondition(p, item)) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  removeItemsByContainer(itemContainer: PangItemContainer) {
    itemContainer.getItems().forEach((item) => {
      this.removeItemByPoint(item.getPointX(), item.getPointY());
    });
  }

  fillItemsY(x: number, y: number): void {
    let items = this.getItemsByPoint(x, y, 'eq', 'lt');
  }

  fillItems(itemContainer: PangItemContainer) {
    itemContainer.getItems().forEach((item) => {
      this.fillItemsY(item.getPointX(), item.getPointY());
    });
  }

  getItems(): PangItem[] {
    return this.items;
  }

  getItemByPoint(x: number, y: number): PangItem {
    let p = { x: x, y: y, conditionX: 'eq', conditionY: 'eq' };
    let result = null;
    let items = this.getItems();

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (this.testItemPointCondition(p, item)) {
        result = item;
        break;
      }
    }
    return result;
  }

  getItemsByPoint(x: number, y: number, conditionX: string, conditionY: string): PangItem[] {
    let p = { x: x, y: y, conditionX: conditionX, conditionY: conditionY };
    let resultItems: PangItem[] = new Array();
    let items = this.getItems();

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (this.testItemPointCondition(p, item)) {
        resultItems.push(item);
      }
    }
    return resultItems;
  }

  testItemPointCondition(p: { x: number, y: number, conditionX: string, conditionY: string }, item: PangItem): boolean {
    let itemX = item.getPointX();
    let itemY = item.getPointY();
    let conditionX = 1;
    let conditionY = 1;
    if (p.conditionX === 'gt') { conditionX = -1; }
    if (p.conditionY === 'gt') { conditionY = -1; }

    // console.log(p.x + ' : ' + p.y + ' : ' + p.conditionX + ' : ' + p.conditionY);
    // console.log(itemX + ' : ' + itemY);

    if (p.conditionX === 'eq' && p.conditionY === 'eq') {
      if (itemX === p.x && itemY === p.y) {
        return true;
      }
    } else if (p.conditionX === 'eq' || p.conditionY === 'eq') {
      if (p.conditionX === 'eq' && itemX === p.x && itemY * conditionY < p.y * conditionY) {
        return true;
      } else if (p.conditionY === 'eq' && itemY === p.y && itemX * conditionX < p.x * conditionX) {
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
