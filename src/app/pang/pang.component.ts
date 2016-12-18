import { Component, OnInit } from '@angular/core';

import '../../vend/pixi.js';
import { PangItem } from './pang.item';
import { PangItemContainer } from './pang.item-container';
import { PangUtil } from './pang.util';
import { ROW, COL } from './pang.config';
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

    private device = 'p';
    private gameItems = new PangItemContainer();
    private selectedItems = new PangItemContainer();
    private selectMarks = new PangItemContainer();
    private matchItemsX = new PangItemContainer();
    private matchItemsY = new PangItemContainer();

    private util = new PangUtil();

    private score = 0;
    private totalTime = 60.0;
    private remain = '0';
    private startTime = 0;
    private plusTime = 0;
    private gameStatus = true;

    constructor() {
        this.stage = new PIXI.Container();
        this.con = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(640, 640);

        this.stage.addChild(this.con);
    }

    ngOnInit(): void {
        if (window.outerWidth < 640) {
            this.device = 'm';
            this.util.setDevice(this.device);
            this.renderer = PIXI.autoDetectRenderer(320, 320);
        }

        document.body.appendChild(this.renderer.view);

        PIXI.loader
            .add('b', '/assets/pang/element_blue_square.png')
            .add('g', '/assets/pang/element_green_square.png')
            .add('p', '/assets/pang/element_purple_square.png')
            .add('r', '/assets/pang/element_red_square.png')
            .add('y', '/assets/pang/element_yellow_square.png')
            .add('s', '/assets/pang/selectorC.png')
            .add('e', '/assets/pang/element_blank_square.png')
            .load((loader, resources) => {
                this.setGameItems();
                this.startTime = Date.now();
                this.render();
            });
    }

    start(): void {
        this.matchRemove();
    }

    reset(): void {
        this.gameItems.destroy();
        this.setGameItems();

        this.startTime = Date.now();
        // this.render();
    }

    render(): void {
        // this.gameItems.setFullFill();
        this.renderer.render(this.stage);
        this.removeAni();

        let remain = this.totalTime - (Date.now() - this.startTime) / 1000;
        if (remain > 0) {
            this.remain = remain.toFixed(3);
        } else {
            this.gameStatus = false;
            this.remain = 'finished...';
        }

        requestAnimationFrame(() => this.render());
    }

    removeAni(): void {
        this.matchItemsX.getItems().forEach((item) => {
            item.getItemObj().rotation += 0.3;
            item.getItemObj().scale.x -= 0.03;
            item.getItemObj().scale.y -= 0.03;
            item.getItemObj().alpha -= 0.01;
        });
        this.matchItemsY.getItems().forEach((item) => {
            item.getItemObj().rotation += 0.3;
            item.getItemObj().scale.x -= 0.03;
            item.getItemObj().scale.y -= 0.03;
            item.getItemObj().alpha -= 0.01;
        });
    }

    matchRemove(): void {
        if (!this.gameStatus) {
            return;
        }

        let matchCnt = 0;
        this.matchItemsX = this.util.getMatchAllItemsX(this.gameItems);
        matchCnt += this.matchItemsX.size();

        this.matchItemsY = this.util.getMatchAllItemsY(this.gameItems);
        matchCnt += this.matchItemsY.size();

        this.score += matchCnt * 50;

        if (matchCnt > 0) {
            setTimeout(() => {
                console.log(this.matchItemsX.size());
                this.util.setEmpty(this.matchItemsX);
                this.gameItems.fillItems(this.matchItemsX);
                this.matchItemsX.clear();

                this.util.setEmpty(this.matchItemsY);
                this.gameItems.fillItems(this.matchItemsY);
                this.matchItemsY.clear();

                this.gameItems.setFullFill();
                this.matchRemove();
            }, 1000);
        }
    }

    setGameItems(): void {
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                this.addItem(col, row);
            }
        }

        this.gameItems.sort();
        this.con.position.x = 20 * (this.device === 'p' ? 2 : 1);
        this.con.position.y = 20 * (this.device === 'p' ? 2 : 1);
    }

    addItem(pointX: number, pointY: number): void {
        let item = this.util.createItem(pointX, pointY, 'r');
        let itemObj = item.getItemObj();

        itemObj.buttonMode = true;
        itemObj.interactive = true;

        itemObj.on('mousedown', () => this.clickItem(pointX, pointY))
            .on('touchstart', () => this.clickItem(pointX, pointY));

        this.con.addChild(itemObj);
        this.gameItems.addItem(item);
    }

    clickItem(pointX: number, pointY: number): void {
        if (!this.gameStatus) {
            return;
        }
        // 선택된 아이템이 2개이상일 경우
        if (this.selectedItems.size() > 1) {
            return;
        }
        // 같은 아이템을 클릭할 경우
        if (this.selectedItems.size() === 1 && this.selectedItems.getItemByPoint(pointX, pointY) !== null) {
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
        // this.render();
    }

    swapItem(): void {
        this.util.swapItems(this.selectedItems);
    }

    selectItem(pointX: number, pointY: number): void {
        let selItem = this.util.createItem(pointX, pointY, 's');
        let sel = selItem.getItemObj();
        let item = this.gameItems.getItemByPoint(pointX, pointY);

        item.getItemObj().alpha = 0.5;

        this.con.addChild(sel);
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
