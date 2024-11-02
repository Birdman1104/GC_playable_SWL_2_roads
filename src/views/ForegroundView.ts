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
import { callIfExists, delayRunnable, makeSprite, tweenToCell } from '../utils';
import { HintView } from './HintView';

const TEXT_DISPLAY_DURATION = 2;

export class ForegroundView extends PixiGrid {
    private hint: HintView | null;
    private blocker: Graphics;
    private buildText: Sprite;
    private provideText: Sprite;

    constructor() {
        super();

        lego.event
            .on(AdModelEvents.StatusUpdate, this.onStatusUpdate, this)
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
    }

    private buildBlocker(): void {
        this.blocker = new Graphics();
        this.blocker.beginFill(0x000000, 1);
        this.blocker.drawRect(0, 0, 10, 10);
        this.blocker.endFill();
        this.blocker.alpha = 0;
        this.setChild('blocker', this.blocker);
    }

    private buildBuildText(): void {
        this.buildText = makeSprite({ texture: Images['game/build_a_house'] });
        this.setChild('text_from', this.buildText);
    }

    private buildProvideText(): void {
        this.provideText = makeSprite({ texture: Images['game/provide_for_citizens'] });
        this.setChild('text_from', this.provideText);
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
            case BoardState.SecondScene:
                this.showSecondScene();
                break;
            case BoardState.Game:
                this.hideBlocker();
                break;

            default:
                break;
        }
    }

    private showFirstScene(): void {
        tweenToCell(this, this.buildText, 'text_show');
        const cb = () => {
            delayRunnable(TEXT_DISPLAY_DURATION, () => {
                this.hideBlocker();
                tweenToCell(this, this.buildText, 'text_to');
            });
        };

        this.showBlocker(cb);
    }

    private showSecondScene(): void {
        tweenToCell(this, this.provideText, 'text_show');
        const cb = () => {
            delayRunnable(TEXT_DISPLAY_DURATION, () => {
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
}
