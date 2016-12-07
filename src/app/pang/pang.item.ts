import { ROW, ROW_SIZE, COL, COL_SIZE } from './pang.config';

interface Point {
  x: number;
  y: number;
}

export class PangItem {
  private itemObj: PIXI.Sprite;
  private position: PIXI.Point;
  private itemType: string;
  private point: Point;

  constructor(itemObj: PIXI.Sprite) {
    this.itemObj = itemObj;
  }

  getItemObj(): PIXI.Sprite {
    return this.itemObj;
  }

  setItemPosition(): void {
    this.position = new PIXI.Point(this.point.x * COL_SIZE, this.point.y * ROW_SIZE);
    this.itemObj.position = this.position;
    console.log(this.position.x);
    console.log(this.position.y);
    // this.point = {x: this.position.x, y: this.position.y};
  }

  setPosition(position: PIXI.Point): void {
    // this.position.copy(position);
    // position.copy(this.position);
    this.position = position;
  }
  getPosition(): PIXI.Point {
    return this.position;
  }

  setPoint(point: Point): void {
    this.point = point;
  }
  getPoint(): Point {
    return this.point;
  }

  getPointX(): number {
    return this.point.x;
  }
  getPointY(): number {
    return this.point.y;
  }

  setItemType(itemType: string): void {
    this.itemType = itemType;
  }
  getItemType(): string {
    return this.itemType;
  }
}
