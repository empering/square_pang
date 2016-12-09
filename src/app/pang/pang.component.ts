import { Component, OnInit } from '@angular/core';

import '../../vend/pixi.js';
import { PangItem } from './pang.item';
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
    private gameMap = new Map<number, PangItem>();
    private selectedMap = new Map<number, PangItem>();
    private selectMarkMap = new Map<number, PangItem>();
    private matchMap = new Map<number, PangItem>();

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

    render(): void {
        // requestAnimationFrame(() => this.render());
        this.matchMap = this.util.getMatchAllItems(this.gameMap);
        this.matchMap.forEach((item) => {
            item.getItemObj().destroy();
        });
        this.matchMap.clear();

        this.renderer.render(this.stage);
    }

    setGameItems(): void {
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                let itemKey = row * 10 + col;
                this.addItem(itemKey);
            }
        }

        this.con.position.x = 4;
        this.con.position.y = 4;
    }

    addItem(itemKey: number): void {
        let randomIdx = Math.floor(Math.random() * 5);
        let itemValue = this.itemArray[randomIdx];
        let item = new PIXI.Sprite(PIXI.loader.resources[itemValue].texture);
        let pointX = itemKey % 10;
        let pointY = Math.floor(itemKey / 10);
        let positionX = pointX * ROW_SIZE;
        let positionY = pointY * COL_SIZE;

        item.position.x = positionX;
        item.position.y = positionY;

        item.scale.x = 2;
        item.scale.y = 2;

        item.buttonMode = true;
        item.interactive = true;

        item.on('mousedown', () => this.clickItem(itemKey))
            .on('touchstart', () => this.clickItem(itemKey));

        this.con.addChild(item);
        let tempItem = new PangItem(item);
        tempItem.setPosition(item.position);
        tempItem.setItemType(itemValue);
        tempItem.setPoint({ x: pointX, y: pointY });

        this.gameMap.set(itemKey, tempItem);

        // this.render();
    }

    clickItem(itemKey: number): void {
        if (this.selectedMap.size > 1) {
            return;
        }

        // 같은 아이템을 클릭할 경우
        if (this.selectedMap.get(itemKey) !== undefined) {
            return;
        }

        this.selectItem(itemKey);

        if (this.selectedMap.size === 2) {
            if (this.util.isNearItems(this.selectedMap)) {
                this.swapItem();
            }

            this.clearSelectItemAll();
        }
        this.render();
        // this.removeItem(itemKey);
    }

    swapItem(): void {
        // swap 기능 개발
        this.util.swapItems(this.selectedMap, this.gameMap);
        this.render();
    }

    selectItem(itemKey: number): void {
        let item = this.gameMap.get(itemKey).getItemObj();
        let sel = new PIXI.Sprite(PIXI.loader.resources['s'].texture);
        sel.position = this.gameMap.get(itemKey).getPosition();
        sel.scale.x = 2;
        sel.scale.y = 2;

        this.con.addChild(sel);

        item.alpha = 0.5;

        let selItem = new PangItem(sel);
        selItem.setPosition(sel.position);
        selItem.setItemType('s');
        selItem.setPoint({ x: sel.position.x, y: sel.position.y });

        this.selectedMap.set(itemKey, this.gameMap.get(itemKey));
        this.selectMarkMap.set(itemKey, selItem);

        this.render();
    }

    clearSelectItem(itemKey: number): void {
        this.selectMarkMap.get(itemKey).getItemObj().destroy();
        this.selectMarkMap.delete(itemKey);
    }

    clearSelectItemAll(): void {
        this.selectMarkMap.forEach((item: PangItem) => {
            item.getItemObj().destroy();
        });
        this.selectedMap.forEach((item: PangItem) => {
            item.getItemObj().alpha = 1;
        });

        this.selectMarkMap.clear();
        this.selectedMap.clear();
    }

    removeItem(itemKey: number): void {
        this.gameMap.get(itemKey).getItemObj().destroy();
        this.addItem(itemKey);
        // this.setGameItems();
    }
}
