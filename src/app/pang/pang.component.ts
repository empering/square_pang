import { Component, OnInit } from '@angular/core';

import '../../vend/pixi.js';
import { PangItem } from './pang.item';
import { PangItemContainer } from './pang.item-container';
import { PangUtil } from './pang.util';
import { ROW, COL, SCORE_LABLE, TIME_LABLE, TEXT_STYLE, START_TEXT, RESTART_TEXT, TIMEUP_TEXT } from './pang.config';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-pang',
    templateUrl: 'pang.component.html',
    styleUrls: ['pang.component.css']
})

export class PangComponent implements OnInit {
    feeds$: Observable<{}>;

    private renderer: PIXI.WebGLRenderer;
    private stage: PIXI.Container;

    private startCon: PIXI.Container;
    private restartCon: PIXI.Container;
    private con: PIXI.Container;
    private scoreCon: PIXI.Container;

    private device = 'p';
    private gameItems = new PangItemContainer();
    private selectedItems = new PangItemContainer();
    private selectMarks = new PangItemContainer();
    private matchItemsX = new PangItemContainer();
    private matchItemsY = new PangItemContainer();

    private scoreText: PIXI.Text;
    private timeText: PIXI.Text;

    private util = new PangUtil();

    private score = 0;
    private totalTime = 60.0;
    private remain = '0';
    private startTime = 0;
    private plusTime = 0;

    private gameStatus = false;
    private removeStatus = false;

    constructor() {
        this.stage = new PIXI.Container();

        this.startCon = new PIXI.Container();
        this.restartCon = new PIXI.Container();
        this.con = new PIXI.Container();
        this.scoreCon = new PIXI.Container();

        this.stage.addChild(this.con);
        this.stage.addChild(this.scoreCon);
        this.stage.addChild(this.startCon);
        this.stage.addChild(this.restartCon);
    }

    ngOnInit(): void {
        if (window.outerWidth < 640) {
            this.device = 'm';
            this.util.setDevice(this.device);
            this.renderer = new PIXI.WebGLRenderer(320, 355);
            this.scoreCon.y = 320;

            TEXT_STYLE.fontSize = '15px';
        } else {
            this.renderer = new PIXI.WebGLRenderer(640, 700);
        }

        document.getElementById('canvas').appendChild(this.renderer.view);

        this.scoreCon.y = this.renderer.width + 10;

        let scoreLabel = new PIXI.Text(SCORE_LABLE, TEXT_STYLE);
        this.scoreCon.addChild(scoreLabel);

        this.scoreText = new PIXI.Text('0', TEXT_STYLE);
        this.scoreText.x = 100 / (this.device === 'm' ? 2 : 1);
        this.scoreCon.addChild(this.scoreText);

        let timeLabel = new PIXI.Text(TIME_LABLE, TEXT_STYLE);
        timeLabel.x = this.renderer.width / 2;
        this.scoreCon.addChild(timeLabel);

        this.timeText = new PIXI.Text('60.000', TEXT_STYLE);
        this.timeText.x = (this.renderer.width / 2) + 150 / (this.device === 'm' ? 2 : 1);
        this.scoreCon.addChild(this.timeText);

        let startText = new PIXI.Text(START_TEXT, TEXT_STYLE);
        startText.style.fontSize = '30px';
        startText.anchor.x = 0.5;
        startText.anchor.y = 0.5;

        startText.buttonMode = true;
        startText.interactive = true;

        startText.on('mousedown', () => this.start()).on('touchstart', () => this.start());

        this.startCon.addChild(startText);
        this.startCon.x = (this.renderer.width / 2);
        this.startCon.y = (this.renderer.height / 2) - 50;

        let restartText = new PIXI.Text(RESTART_TEXT, TEXT_STYLE);
        restartText.style.fontSize = '30px';
        restartText.position.y = 45;
        restartText.anchor.x = 0.5;
        restartText.anchor.y = 0.5;

        restartText.buttonMode = true;
        restartText.interactive = true;

        restartText.on('mousedown', () => this.reset()).on('touchstart', () => this.reset());

        let timeupText = new PIXI.Text(TIMEUP_TEXT, TEXT_STYLE);
        timeupText.style.fontSize = '30px';
        timeupText.anchor.x = 0.5;
        timeupText.anchor.y = 0.5;

        this.restartCon.addChild(timeupText);
        this.restartCon.addChild(restartText);
        this.restartCon.x = (this.renderer.width / 2);
        this.restartCon.y = (this.renderer.height / 2) - 60;

        this.restartCon.visible = false;

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
                this.render();
            });
    }

    start(): void {
        this.startTime = Date.now();
        this.gameStatus = true;
        this.startCon.visible = false;

        this.matchRemove();
    }

    reset(): void {
        this.gameItems.destroy();
        this.setGameItems();

        this.score = 0;

        this.startTime = Date.now();
        this.gameStatus = true;
        this.restartCon.visible = false;

        this.matchRemove();
    }

    showScore(): void {
        this.scoreText.text = this.score.toString();

        let remain = this.totalTime - (Date.now() - this.startTime) / 1000;
        if (remain > 0) {
            this.remain = remain.toFixed(3);
        } else {
            this.gameStatus = false;
            this.restartCon.visible = true;

            this.remain = 'finished!!';
        }
        this.timeText.text = this.remain;
    }

    render(): void {
        this.renderer.render(this.stage);
        if (this.gameStatus) {
            this.removeAni();
            this.showScore();
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
        if (matchCnt > 3) {
            this.score += matchCnt * 50;
        }

        if (matchCnt > 0) {
            this.removeStatus = true;
            setTimeout(() => {
                this.util.setEmpty(this.matchItemsX);
                this.gameItems.fillItems(this.matchItemsX);
                this.matchItemsX.clear();

                this.util.setEmpty(this.matchItemsY);
                this.gameItems.fillItems(this.matchItemsY);
                this.matchItemsY.clear();

                this.gameItems.setFullFill();
                this.matchRemove();

                this.removeStatus = false;
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
        if (!this.gameStatus || this.removeStatus) {
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
