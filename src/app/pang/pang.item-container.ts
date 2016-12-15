import { PangItem } from './pang.item';
import { PangUtil } from './pang.util';

export class PangItemContainer {
  private items: PangItem[];
  private util = new PangUtil();

  constructor() {
    this.items = new Array();
  }

  addItem(item: PangItem): void {
    this.items.push(item);
  }

  addItems(itemsContainer: PangItemContainer): void {
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
    this.items.splice(0);
  }

  destroy(): void {
    this.items.forEach((item) => {
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

  fillItemY(x: number, y: number): void {
    let startItem = this.getItemByPoint(x, y);
    let items = this.getItemsByPoint(x, y, 'eq', 'lt');
    items.push(startItem);
    items.sort((a, b) => {
      return b.getPointY() - a.getPointY();
    });

    for (let i = 1; i < items.length; i++) {
      this.util.swapItem(items[i - 1], items[i]);
    }

    // items.forEach((item) => {
    //   console.log('fill target item point : ' + item.getPointX() + ' : ' + item.getPointY());
    //   item.getItemObj().alpha = 0.5;
    //   if (item.getPointY() === y) {
    //     console.log('start item pass!');
    //   } else {
    //     console.log('swap item');
    //   }
    // });
  }

  fillItems(itemContainer: PangItemContainer) {
    itemContainer.getItems().forEach((item) => {
      // console.log('target item point : ' + item.getPointX() + ' : ' + item.getPointY());
      this.fillItemY(item.getPointX(), item.getPointY());
    });
  }

  setFullFill() {
    this.items.forEach((item) => {
      if (item.getItemType() === 'e') {
        let type = this.util.makeRandomTexture();
        item.getItemObj().texture = PIXI.loader.resources[type].texture;
        item.setItemType(type);
      }
    });
  };

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
