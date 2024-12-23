import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { HintModelEvents } from '../events/ModelEvents';
import { BoardState } from '../models/BoardModel';
import Head from '../models/HeadModel';
import { getViewByProperty, lp, makeSprite } from '../utils';

export class HintView extends Container {
    private hand: Sprite;
    private hintPositions: Point[] = [];
    private currentPoint = 0;

    constructor() {
        super();

        lego.event.on(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

        this.build();
        this.hide();
    }

    get viewName() {
        return 'HintView';
    }

    public destroy(): void {
        this.removeTweens();
        lego.event.off(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

        super.destroy();
    }

    private onHintVisibleUpdate(visible: boolean): void {
        visible ? this.show() : this.hide();
    }

    private build(): void {
        this.hand = makeSprite({ texture: Images['game/hand'] });
        this.hand.anchor.set(0);
        this.addChild(this.hand);
    }

    private show(): void {
        this.removeTweens();
        this.hintPositions = this.getHintPosition();
        if (this.hintPositions.length === 0) return;
        this.currentPoint = 0;

        this.showFirstTime();
    }

    private hide(): void {
        this.removeTweens();
        this.hand.visible = false;
    }

    private showFirstTime(): void {
        const point = this.hintPositions[this.currentPoint];
        this.hand.scale.set(lp(0.8, 0.5));
        this.hand.alpha = 1;
        this.hand.position.set(point.x, point.y);
        this.hand.angle = 0;
        this.hand.visible = true;

        this.pointHand();
    }

    private pointHand(): void {
        const scale = lp(0.6, 0.4);
        anime({
            targets: this.hand.scale,
            x: scale,
            y: scale,
            duration: 500,
            easing: 'easeInOutCubic',
            direction: 'alternate',
            complete: () => {
                this.currentPoint += 1;
                if (this.currentPoint >= this.hintPositions.length) {
                    this.currentPoint = 0;
                }
                this.moveHand(this.hintPositions[this.currentPoint]);
            },
        });
    }

    private moveHand(pos): void {
        anime({
            targets: this.hand,
            x: pos.x,
            y: pos.y,
            duration: 500,
            easing: 'easeInOutCubic',
            complete: () => this.pointHand(),
        });
    }

    private removeTweens(): void {
        anime.remove(this.hand);
        anime.remove(this.hand.scale);
    }

    private getHintPosition(): Point[] {
        const state = Head.gameModel?.board?.state;

        if (state === BoardState.FirstScene) {
            return this.getHouseButtonPosition();
        } else if (state === BoardState.SecondScene) {
            return this.getOtherButtonsPosition();
        } else if (state === BoardState.Game) {
            return this.getActiveButtonsPosition();
        } else {
            return [];
        }
    }

    private getHouseButtonPosition() {
        const bottomBar = getViewByProperty('viewName', 'BottomBar');
        return bottomBar.getHouseButtonPosition();
    }

    private getOtherButtonsPosition() {
        const bottomBar = getViewByProperty('viewName', 'BottomBar');
        return bottomBar.getOtherButtonsHintPositions();
    }

    private getActiveButtonsPosition() {
        const bottomBar = getViewByProperty('viewName', 'BottomBar');
        return bottomBar.getActiveButtonsHintPositions();
    }
}
