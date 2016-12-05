export class PangItem {
  private itemObj: PIXI.Sprite;
  private position: PIXI.Point;
  private itemType: string;

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

  setItemType(itemType: string): void {
    this.itemType = itemType;
  }
  getItemType(): string {
    return this.itemType;
  }
}
