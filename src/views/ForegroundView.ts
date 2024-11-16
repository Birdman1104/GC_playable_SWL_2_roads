import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import anime from 'animejs';
import { Graphics, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { AdModelEvents, BoardModelEvents } from '../events/ModelEvents';
import { AdStatus } from '../models/AdModel';
import { BoardState } from '../models/BoardModel';
import { HintModel } from '../models/HintModel';
import { callIfExists, delayRunnable, makeSprite, removeRunnable, tweenToCell } from '../utils';
import { BottomBar } from './BottomBar';
import { HintView } from './HintView';
import { Sound } from './SoundView';

const TEXT_DISPLAY_DURATION = 2;

export class ForegroundView extends PixiGrid {
    private sound: Sound;
    private hint: HintView | null;
    private blocker: Graphics;
    private buildText: Sprite;
    private provideText: Sprite;
    private bottomBar: BottomBar;
    private runnable: any;

    constructor() {
        super();

        lego.event
            .on(AdModelEvents.StatusUpdate, this.onStatusUpdate, this)
            .on(AdModelEvents.SoundUpdate, this.onSoundUpdate, this)
            .on(AdModelEvents.HintUpdate, this.onHintUpdate, this)
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this);
    }

    get viewName(): string {
        return 'ForegroundView';
    }

    public getGridConfig(): ICellConfig {
        return getForegroundGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        this.buildBlocker();
        this.buildBuildText();
        this.buildProvideText();
        this.buildBottomBar();
    }

    private buildBlocker(): void {
        this.blocker = new Graphics();
        this.blocker.beginFill(0x000000, 1);
        this.blocker.drawRect(0, 0, 10, 10);
        this.blocker.endFill();
        this.blocker.alpha = 0;
        this.setChild('blocker', this.blocker);
        this.bringToFront(this.sound, 'sound');
    }

    private buildBuildText(): void {
        this.buildText = makeSprite({ texture: Images['game/build_a_house'] });
        this.setChild('text_from', this.buildText);
        this.bringToFront(this.sound, 'sound');
    }

    private buildProvideText(): void {
        this.provideText = makeSprite({ texture: Images['game/provide_for_citizens'] });
        this.setChild('text_from', this.provideText);
        this.bringToFront(this.sound, 'sound');
    }

    private onStatusUpdate(status: AdStatus): void {
        switch (status) {
            case AdStatus.Game:
                this.build();
                break;

            case AdStatus.PreCta:
                //
                break;

            default:
                break;
        }
    }

    private onHintUpdate(hint: HintModel | null): void {
        hint ? this.buildHint() : this.destroyHint();
    }

    private buildHint(): void {
        this.hint = new HintView();
        this.addChild(this.hint);
    }

    private destroyHint(): void {
        this.hint?.destroy();
        this.hint = null;
    }

    private onBoardStateUpdate(newState: BoardState): void {
        switch (newState) {
            case BoardState.FirstScene:
                this.showFirstScene();
                break;
            case BoardState.Idle:
                removeRunnable(this.runnable);
                this.hideBlocker();
                tweenToCell(this, this.buildText, 'text_to');
                break;
            case BoardState.SecondScene:
                this.showSecondScene();
                break;
            case BoardState.Game:
                removeRunnable(this.runnable);
                tweenToCell(this, this.provideText, 'text_to');
                this.hideBlocker();
                break;

            default:
                break;
        }
    }

    private showFirstScene(): void {
        tweenToCell(this, this.buildText, 'text_show');
        const cb = () => {
            this.runnable = delayRunnable(TEXT_DISPLAY_DURATION, () => {
                this.hideBlocker();
                tweenToCell(this, this.buildText, 'text_to');
            });
        };

        this.showBlocker(cb);
    }

    private showSecondScene(): void {
        tweenToCell(this, this.provideText, 'text_show');
        const cb = () => {
            this.runnable = delayRunnable(TEXT_DISPLAY_DURATION, () => {
                this.hideBlocker();
                tweenToCell(this, this.provideText, 'text_to');
            });
        };

        this.showBlocker(cb);
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

    private onSoundUpdate(sound: boolean): void {
        if (sound) {
            this.sound = new Sound();
            this.setChild('sound', this.sound);
        }
    }

    private bringToFront(child: any, cell: string): void {
        if (!child) return;
        this.removeContent(child);
        this.setChild(cell, child);
    }

    private buildBottomBar(): void {
        this.bottomBar = new BottomBar();
        this.bottomBar.on('rebuild', this.rebuild, this);
        this.setChild('bottomBar', this.bottomBar);
    }
}
