import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import anime from 'animejs';
import { Graphics, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { getCTAGridConfig } from '../configs/gridConfigs/CTAViewGC';
import { TakeMe } from '../events/MainEvents';
import { BoardModelEvents, CtaModelEvents } from '../events/ModelEvents';
import { BoardState } from '../models/BoardModel';
import { callIfExists, delayRunnable, makeSprite } from '../utils';

export class CTAView extends PixiGrid {
    private blocker: Graphics;
    private failIcon: Sprite;
    private downloadButton: Sprite;
    private activeBlocker = true;

    constructor() {
        super();

        lego.event
            .on(CtaModelEvents.VisibleUpdate, this.visibleUpdate, this)
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this);

        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getCTAGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private onBoardStateUpdate(newState: BoardState): void {
        switch (newState) {
            case BoardState.Fail:
                this.activeBlocker = false;
                this.showFail();
                break;

            default:
                break;
        }
    }

    private build(): void {
        this.blocker = new Graphics();
        this.blocker.beginFill(0x000000, 1);
        this.blocker.drawRect(0, 0, 10, 10);
        this.blocker.endFill();
        this.blocker.alpha = 0;
        this.setChild('blocker', this.blocker);
    }

    private visibleUpdate(visible: boolean): void {
        this.blocker.interactive = true;
        this.blocker.on('pointerdown', () => {
            this.activeBlocker && lego.event.emit(TakeMe.ToStore);
        });
    }

    private showFail(): void {
        delayRunnable(0.5, () => {
            this.failIcon = makeSprite({ texture: Images['game/fail'] });
            this.failIcon.visible = true;
            this.setChild('fail_icon', this.failIcon);
            const scaleIcon = this.failIcon.scale.x;
            this.failIcon.scale.set(0);
            this.showBlocker();

            this.downloadButton = makeSprite({ texture: Images['game/download'] });
            this.downloadButton.visible = true;
            this.setChild('button', this.downloadButton);
            const scaleButton = this.downloadButton.scale.x;
            this.downloadButton.scale.set(0);
            this.showBlocker();

            anime({
                targets: this.failIcon.scale,
                x: scaleIcon,
                y: scaleIcon,
                duration: 600,
                easing: 'easeOutElastic',
            });
            anime({
                targets: this.downloadButton.scale,
                x: scaleButton,
                y: scaleButton,
                duration: 600,
                easing: 'easeOutElastic',
                complete: () => {
                    this.downloadButton.interactive = true;
                    this.downloadButton.on('pointerdown', () => {
                        lego.event.emit(TakeMe.ToStore);
                    });
                    anime({
                        targets: this.downloadButton.scale,
                        x: [scaleButton, scaleButton * 1.1, scaleButton],
                        y: [scaleButton, scaleButton * 1.1, scaleButton],
                        duration: 500,
                        easing: 'easeInOutSine',
                        directions: 'alternate',
                        loop: true,
                    });
                },
            });
        });
    }

    private showBlocker(cb?): void {
        this.blocker.interactive = true;
        anime({
            targets: this.blocker,
            alpha: 0.6,
            duration: 100,
            easing: 'easeInOutSine',
            complete: () => callIfExists(cb),
        });
    }

    private hideBlocker(cb?): void {
        this.blocker.interactive = false;
        anime({
            targets: this.blocker,
            alpha: 0,
            duration: 100,
            easing: 'easeInOutSine',
            complete: () => callIfExists(cb),
        });
    }
}
