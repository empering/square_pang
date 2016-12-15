import { Component, OnInit } from '@angular/core';

import '../../vend/pixi.js';
import { PangItem } from './pang.item';
import { PangItemContainer } from './pang.item-container';
import { PangUtil } from './pang.util';
import { ROW, ROW_SIZE, COL, COL_SIZE } from './pang.config';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-pang',
    templateUrl: 'pang.component.html',
    styleUrls: ['pang.component.css']
})

export class PangComponent implements OnInit {
    feeds$: Observable<{}>;

    private renderer: any;
    private stage: PIXI.Container;
    private con: PIXI.Container;

    private itemArray = new Array();
    private gameItems = new PangItemContainer();
    private selectedItems = new PangItemContainer();
    private selectMarks = new PangItemContainer();
    private matchItemsX = new PangItemContainer();
    private matchItemsY = new PangItemContainer();

    private util = new PangUtil();

    constructor() {
        this.stage = new PIXI.Container();
        this.con = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(640, 640);

        this.stage.addChild(this.con);

        this.itemArray.push('b');
        this.itemArray.push('g');
        this.itemArray.push('p');
        this.itemArray.push('r');
        this.itemArray.push('y');
    }

    ngOnInit(): void {
        document.body.appendChild(this.renderer.view);

        PIXI.loader
            .add('b', '/assets/pang/element_blue_square.png')
            .add('g', '/assets/pang/element_green_square.png')
            .add('p', '/assets/pang/element_purple_square.png')
            .add('r', '/assets/pang/element_red_square.png')
            .add('y', '/assets/pang/element_yellow_square.png')
            .add('s', '/assets/pang/selectorC.png')
            .load((loader, resources) => {
                this.setGameItems();
                this.render();
            });
    }

    start(): void {
        this.matchRemove();
    }

    reset(): void {
        this.gameItems.destroy();

        this.setGameItems();
        this.render();
    }

    render(): void {
        // requestAnimationFrame(() => this.render());
        this.renderer.render(this.stage);
    }

    matchRemove(): void {
        this.matchItemsX = this.util.getMatchAllItemsX(this.gameItems);
        // remove 대신 blank 이미지로 교체하는 형태로 변경
        this.gameItems.removeItemsByContainer(this.matchItemsX);
        // fill function
        this.gameItems.fillItems(this.matchItemsX);
        this.matchItemsX.destroy();

        // this.matchItemsY = this.util.getMatchAllItemsY(this.gameItems);
        // this.gameItems.removeItemsByContainer(this.matchItemsY);
        // // fill function
        // this.matchItemsY.destroy();

        this.render();
    }

    setGameItems(): void {
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                this.addItem(col, row);
            }
        }

        this.gameItems.sort();
        this.con.position.x = 4;
        this.con.position.y = 4;
    }

    addItem(pointX: number, pointY: number): void {
        let randomIdx = Math.floor(Math.random() * 5);
        let itemValue = this.itemArray[randomIdx];
        let item = new PIXI.Sprite(PIXI.loader.resources[itemValue].texture);
        let positionX = pointX * COL_SIZE;
        let positionY = pointY * ROW_SIZE;

        item.position.x = positionX;
        item.position.y = positionY;

        item.scale.x = 2;
        item.scale.y = 2;

        item.buttonMode = true;
        item.interactive = true;

        item.on('mousedown', () => this.clickItem(pointX, pointY))
            .on('touchstart', () => this.clickItem(pointX, pointY));

        this.con.addChild(item);
        let tempItem = new PangItem(item);
        tempItem.setPosition(item.position);
        tempItem.setItemType(itemValue);
        tempItem.setPoint({ x: pointX, y: pointY });

        this.gameItems.addItem(tempItem);
    }

    clickItem(pointX: number, pointY: number): void {
        // console.log('click : ' + pointX + ' : ' + pointY + ' : size : ' + this.selectedItems.size());
        if (this.selectedItems.size() > 1) {
            return;
        }

        // 같은 아이템을 클릭할 경우
        if (this.selectedItems.size() === 1 && this.selectedItems.getItemByPoint(pointX, pointY) !== null) {
            console.log('equals');
            return;
        }

        this.selectItem(pointX, pointY);

        if (this.selectedItems.size() === 2) {
            if (this.util.isNearItems(this.selectedItems)) {
                this.swapItem();
                this.matchRemove();
            }
            this.clearSelectItemAll();
        }
        this.render();
        // this.removeItem(itemKey);
    }

    swapItem(): void {
        // swap 기능 개발
        this.util.swapItems(this.selectedItems);
    }

    selectItem(pointX: number, pointY: number): void {
        console.log('selected : ' + pointX + ' : ' + pointY);
        let sel = new PIXI.Sprite(PIXI.loader.resources['s'].texture);
        let item = this.gameItems.getItemByPoint(pointX, pointY);
        console.log(item.getPointX() + ' : ' + item.getPointY());
        sel.position = item.getPosition();
        sel.scale.x = 2;
        sel.scale.y = 2;

        this.con.addChild(sel);

        item.getItemObj().alpha = 0.5;

        let selItem = new PangItem(sel);
        selItem.setPosition(sel.position);
        selItem.setItemType('s');
        selItem.setPoint({ x: sel.position.x, y: sel.position.y });

        this.selectedItems.addItem(item);
        this.selectMarks.addItem(selItem);
    }

    clearSelectItemAll(): void {
        this.selectMarks.destroy();
        this.selectedItems.getItems().forEach((item: PangItem) => {
            item.getItemObj().alpha = 1;
        });

        this.selectedItems.clear();
    }
}
