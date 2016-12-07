import { PangItem } from './pang.item';

export class PangUtil {
  isNearItem(item1: PangItem, item2: PangItem): boolean {
    let flag = false;
    if (item1.getPointX() === item2.getPointX() && Math.abs(item1.getPointY() - item2.getPointY()) === 1 ) {
      flag = true;
    } else if (item1.getPointY() === item2.getPointY() && Math.abs(item1.getPointX() - item2.getPointX()) === 1 ) {
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
}
