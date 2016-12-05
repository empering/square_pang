import { Component, OnInit } from '@angular/core';

import '../../vend/pixi.js';
import { PangItem } from './pang.item';
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

    private itemArray = new Array();
    private gameMap = new Map<number, PangItem>();

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
            .add('b', '/public/img/pang/element_blue_square.png')
            .add('g', '/public/img/pang/element_green_square.png')
            .add('p', '/public/img/pang/element_purple_square.png')
            .add('r', '/public/img/pang/element_red_square.png')
            .add('y', '/public/img/pang/element_yellow_square.png')
            .add('s', '/public/img/pang/selectorC.png')
            .load((loader, resources) => {
                this.setGameItems();
                this.render();
            });
    }

    render(): void {
        // requestAnimationFrame(() => this.render());
        this.renderer.render(this.stage);
    }

    setGameItems(): void {
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                let itemKey = row * COL + col;
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
        let positionX = itemKey % COL * 80;
        let positionY = Math.floor(itemKey / ROW) * 80;

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

        this.gameMap.set(itemKey, tempItem);

        this.render();
    }

    clickItem(itemKey: number): void {
        let item = this.gameMap.get(itemKey).getItemObj();
        let sel = new PIXI.Sprite(PIXI.loader.resources['s'].texture);
        sel.position = this.gameMap.get(itemKey).getPosition();
        sel.scale.x = 2;
        sel.scale.y = 2;

        this.con.addChild(sel);

        item.alpha = 0.5;

        this.render();
        // this.removeItem(itemKey);
    }

    removeItem(itemKey: number): void {
        this.gameMap.get(itemKey).getItemObj().destroy();
        this.addItem(itemKey);
        // this.setGameItems();
    }
}
