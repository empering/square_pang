import { PangItem } from './pang.item';
import { ROW, ROW_SIZE, COL, COL_SIZE } from './pang.config';

export class PangUtil {
  isNearItem(item1: PangItem, item2: PangItem): boolean {
    let flag = false;
    if (item1.getPointX() === item2.getPointX() && Math.abs(item1.getPointY() - item2.getPointY()) === 1) {
      flag = true;
    } else if (item1.getPointY() === item2.getPointY() && Math.abs(item1.getPointX() - item2.getPointX()) === 1) {
      flag = true;
    }
    return flag;
  }

  isNearItems(items: Map<number, PangItem>): boolean {
    let flag = false;
    if (items.size === 2) {
      let keys = items.keys();
      let item1 = items.get(keys.next().value);
      let item2 = items.get(keys.next().value);
      flag = this.isNearItem(item1, item2);
    } else {
      // alert('item size : ' + items.size);
    }
    return flag;
  }

  swapItems(items: Map<number, PangItem>, allItems: Map<number, PangItem>): void {
    let keys = items.keys();
    let item1Key = keys.next().value;
    let item2Key = keys.next().value;

    let item1 = items.get(item1Key);
    let item2 = items.get(item2Key);

    // log positon
    // console.log('item1 position : ' + item1.getItemObj().position.x + 'x' + item1.getItemObj().position.y);
    // console.log(item1.getPoint());
    // console.log('item2 position : ' + item2.getItemObj().position.x + 'x' + item2.getItemObj().position.y);
    // console.log(item2.getPoint());

    let temp = item1.getPoint();
    item1.setPoint(item2.getPoint());
    item2.setPoint(temp);

    // allItems.set(item1Key, item2);
    // allItems.set(item2Key, item1);

    item1.setItemPosition();
    item2.setItemPosition();
  }

  getMatchAllItems(items: Map<number, PangItem>): Map<number, PangItem> {
    let matchItems = new Map<number, PangItem>();

    for (let r = 0; r < ROW; r++) {
      for (let c = 0; c < COL - 3; c++) {
        let itemKey1 = r * 10 + c;
        let itemKey2 = itemKey1 + 1;
        let itemKey3 = itemKey1 + 2;

        let item1 = items.get(itemKey1);
        let item2 = items.get(itemKey2);
        let item3 = items.get(itemKey3);

        if (item1.getItemType() === item2.getItemType() && item1.getItemType() === item3.getItemType()) {
          matchItems.set(itemKey1, item1);
          matchItems.set(itemKey2, item2);
          matchItems.set(itemKey3, item3);
          if (COL - 3 > c + 2) {
            let itemKey4 = itemKey1 + 3;
            let item4 = items.get(itemKey4);
            if (item1.getItemType() === item4.getItemType()) {
              matchItems.set(itemKey4, item4);
            }
          }
        }

      }
    }

    return matchItems;
  }
}
