import { lego } from '@armathai/lego';
import { Howl } from 'howler';
import { BoardEvents, BottomBarEvents, SoundEvents } from './events/MainEvents';
import { AreaModelEvents, BoardModelEvents } from './events/ModelEvents';
import { BoardState } from './models/BoardModel';
import { ATTENTION } from './sounds/attention';
import { BUILD } from './sounds/build';
import { CLICK } from './sounds/click';
import { COINS_DECREASE } from './sounds/coinsDecrease';
import { THEME } from './sounds/theme';
import { delayRunnable } from './utils';

let i = 0;
class SoundControl {
    private sounds: any;
    private isMutedFromIcon = false;

    public constructor() {
        lego.event
            .on(SoundEvents.Mute, this.mute, this)
            .on(SoundEvents.Unmute, this.unmute, this)
            .on(BoardEvents.BkgPointerDown, this.playClick, this)
            .on(BottomBarEvents.ButtonClicked, this.playClick, this)
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this)
            .on(BoardModelEvents.HealthUpdate, this.onProgressBarUpdate, this)
            .on(BoardModelEvents.JoyUpdate, this.onProgressBarUpdate, this)
            .on(BoardModelEvents.FoodUpdate, this.onProgressBarUpdate, this)
            .on(BoardModelEvents.CoinsUpdate, this.onCoinsUpdate, this)
            .on(AreaModelEvents.BuildingUpdate, this.onAreaBuildingUpdate, this);

        this.sounds = {};
    }

    public loadSounds(): void {
        this.sounds.attention = new Howl({ src: ATTENTION });
        this.sounds.build = new Howl({ src: BUILD });
        this.sounds.click = new Howl({ src: CLICK });
        this.sounds.coins = new Howl({ src: COINS_DECREASE });
        this.sounds.theme = new Howl({ src: THEME, loop: true, volume: 0.3 });
    }

    private onProgressBarUpdate(value: number): void {
        if (value === 1) {
            delayRunnable(0.7, () => {
                this.playAttention();
            });
        }
    }

    private onCoinsUpdate(newValue: number, oldValue: number): void {
        if (newValue < oldValue) {
            delayRunnable(0.35, () => {
                this.playCoinsDecrease();
            });
        }
    }

    private onAreaBuildingUpdate(): void {
        if (i >= 6) {
            this.playBuild();
        }
        i++;
    }

    private onBoardStateUpdate(state: BoardState): void {
        if (state === BoardState.FirstScene) {
            this.playTheme();
        }
    }

    private playClick(): void {
        this.sounds.click.play();
    }

    private playAttention(): void {
        this.sounds.attention.play();
    }

    private playBuild(): void {
        this.sounds.build.play();
    }

    private playCoinsDecrease(): void {
        this.sounds.coins.play();
    }

    private playTheme(): void {
        this.sounds.theme.play();
    }

    private mute(): void {
        this.isMutedFromIcon = true;
        for (const [key, value] of Object.entries(this.sounds)) {
            // @ts-ignore
            value.volume(0);
        }
    }

    private unmute(): void {
        this.isMutedFromIcon = false;
        for (const [key, value] of Object.entries(this.sounds)) {
            // @ts-ignore
            value.volume(key === 'theme' ? 0.3 : 1);
        }
    }

    private focusChange(outOfFocus: boolean): void {
        if (this.isMutedFromIcon) return;
        for (const [key, value] of Object.entries(this.sounds)) {
            // @ts-ignore
            value.volume(outOfFocus ? 0 : key === 'theme' ? 0.3 : 1);
        }
    }
}

const SoundController = new SoundControl();
export default SoundController;
