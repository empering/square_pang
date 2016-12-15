import { PangItem } from './pang.item';
import { PangItemContainer } from './pang.item-container';
import { ROW, COL, COL_SIZE } from './pang.config';

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

  isNearItems(targetItems: PangItemContainer): boolean {
    let flag = false;
    if (targetItems.size() === 2) {
      let items = targetItems.getItems();
      let item1 = items[0];
      let item2 = items[1];
      flag = this.isNearItem(item1, item2);
    } else {
      // alert('item size : ' + items.size);
    }
    return flag;
  }

  swapItems(targetItems: PangItemContainer): void {
    let items = targetItems.getItems();

    let item1 = items[0];
    let item2 = items[1];

    let temp = item1.getItemType();
    item1.getItemObj().texture = PIXI.loader.resources[item2.getItemType()].texture;
    item1.setItemType(item2.getItemType());
    item2.getItemObj().texture = PIXI.loader.resources[temp].texture;
    item2.setItemType(temp);
  }

  getMatchAllItemsX(items: PangItemContainer): PangItemContainer {
    let matchItems = new PangItemContainer();

    for (let r = ROW - 1; r >= 0; r--) {
      let tempItems = items.getItemsByPoint(-1, r, 'gt', 'eq');
      let tempMatchItems = new PangItemContainer();
      let matchCnt = { b: 0, g: 0, p: 0, r: 0, y: 0 };
      let prevType = '';
      tempItems.sort((a, b) => {
        return a.getPointX() - b.getPointX();
      });

      tempItems.forEach((item, i, tempItemsAll) => {
        if (prevType === '') {
          prevType = item.getItemType();
          matchCnt[prevType]++;
        } else if (prevType === item.getItemType()) {
          matchCnt[prevType]++;
        } else {
          matchCnt[prevType] = 0;
          prevType = item.getItemType();
          matchCnt[prevType] = 1;
        }

        if (matchCnt[prevType] === 3) {
          tempMatchItems.addItem(tempItemsAll[i - 2]);
          tempMatchItems.addItem(tempItemsAll[i - 1]);
          tempMatchItems.addItem(item); // tempItemsAll[i]
        } else if (matchCnt[prevType] > 3) {
          tempMatchItems.addItem(item);
        }
      });
      matchItems.addItems(tempMatchItems);
    }
    return matchItems;
  }

  getMatchAllItemsY(items: PangItemContainer): PangItemContainer {
    let matchItems = new PangItemContainer();

    for (let c = 0; c < COL; c++) {
      let tempItems = items.getItemsByPoint(c, -1, 'eq', 'gt');
      let tempMatchItems = new PangItemContainer();
      let matchCnt = { b: 0, g: 0, p: 0, r: 0, y: 0 };
      let prevType = '';
      tempItems.sort((a, b) => {
        return b.getPointY() - a.getPointY();
      });

      tempItems.forEach((item, i, tempItemsAll) => {
        if (prevType === '') {
          prevType = item.getItemType();
          matchCnt[prevType]++;
        } else if (prevType === item.getItemType()) {
          matchCnt[prevType]++;
        } else {
          matchCnt[prevType] = 0;
          prevType = item.getItemType();
          matchCnt[prevType] = 1;
        }

        if (matchCnt[prevType] === 3) {
          tempMatchItems.addItem(tempItemsAll[i - 2]);
          tempMatchItems.addItem(tempItemsAll[i - 1]);
          tempMatchItems.addItem(item); // tempItemsAll[i]
        } else if (matchCnt[prevType] > 3) {
          tempMatchItems.addItem(item);
        }
      });
      matchItems.addItems(tempMatchItems);
    }
    return matchItems;
  }
}
