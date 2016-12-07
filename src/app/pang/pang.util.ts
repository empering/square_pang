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

  swapItems(items: Map<number, PangItem>): void {
    let keys = items.keys();
    let item1 = items.get(keys.next().value);
    let item2 = items.get(keys.next().value);

    console.log('item1 position : ' + item1.getItemObj().position.x + 'x' + item1.getItemObj().position.y);
    console.log(item1.getPoint());
    console.log('item2 position : ' + item2.getItemObj().position.x + 'x' + item2.getItemObj().position.y);
    console.log(item2.getPoint());
    
    let temp = item1.getPoint();
    item1.setPoint(item2.getPoint());
    item2.setPoint(temp);

    // item1.setPosition(item2.getItemObj().position);
    // item2.setPosition(item1.getItemObj().position);

    item1.setItemPosition();
    item2.setItemPosition();

    console.log('item1 position : ' + item1.getItemObj().position.x + 'x' + item1.getItemObj().position.y);
    console.log(item1.getPoint());
    console.log('item2 position : ' + item2.getItemObj().position.x + 'x' + item2.getItemObj().position.y);
    console.log(item2.getPoint());
  }
}
