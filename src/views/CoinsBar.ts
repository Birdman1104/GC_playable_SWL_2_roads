import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point, Sprite, Text } from 'pixi.js';
import { Images } from '../assets';
import { BoardModelEvents } from '../events/ModelEvents';
import { delayRunnable, fitText, makeSprite } from '../utils';

export class CoinsBar extends Container {
    private icon: Sprite;
    private bkg: Sprite;
    private coinsText: Text;

    constructor() {
        super();

        lego.event.on(BoardModelEvents.CoinsUpdate, this.onCoinsUpdate, this);
        this.build();
    }

    private build(): void {
        this.bkg = makeSprite({ texture: Images['game/progress_bkg'], anchor: new Point(0.5) });

        this.icon = makeSprite({ texture: Images['game/coin_icon'], anchor: new Point(0.5) });
        this.icon.position.set(-50, -25);

        this.coinsText = new Text('1000', { fontSize: 28, fill: 0xffffff });
        this.coinsText.anchor.set(0.5);
        this.coinsText.position.set(43, 20);
        fitText(this.coinsText, 90, 45);

        this.addChild(this.bkg, this.coinsText, this.icon);
    }

    private onCoinsUpdate(value: number): void {
        delayRunnable(0.35, () => {
            const scale = value < +this.coinsText.text ? 0.8 : 1.2;
            this.coinsText.text = `${value}`;
            fitText(this.coinsText, 90, 45);
            anime({
                targets: this.coinsText.scale,
                x: scale,
                y: scale,
                duration: 100,
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: 1,
                complete: () => {
                    this.coinsText.scale.set(1);
                },
            });
        });
    }
}
