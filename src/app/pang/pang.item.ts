export class PangItem {
  private itemObj: PIXI.Sprite;
  private position: PIXI.Point;
  private itemType: string;
  private point: {x: number, y: number};

  constructor(itemObj: PIXI.Sprite) {
    this.itemObj = itemObj;
  }

  getItemObj(): PIXI.Sprite {
    return this.itemObj;
  }

  setItemPosition(): void {
    this.itemObj.position = this.position;
  }

  setPosition(position: PIXI.Point): void {
    this.position = position;
  }
  getPosition(): PIXI.Point {
    return this.position;
  }

  setPoint(point:{x: number, y: number}): void {
    this.point = point;
  }
  getPoint(): any {
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
