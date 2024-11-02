import anime from 'animejs';
import { Container, Graphics, Point, Sprite, Text } from 'pixi.js';
import { Images } from '../assets';
import { BAR_MAX, BarType } from '../configs/constants';
import { delayRunnable, makeSprite } from '../utils';

const BAR_TINT = [
    0xff0000, // 0 points +
    0xd73b20, // 1 point +
    0xd77120, // 2 points
    0xd7ac20, // 3 points
    0xb2d720, // 4 points
    0x01dd55, // 5 points +
];
export class ProgressBar extends Container {
    private icon: Sprite;
    private progressBar: Sprite;
    private progressBkg: Sprite;
    private valueText: Text;
    private maskGr: Graphics;
    private value: number;

    constructor(private _type: BarType) {
        super();
        this.build();
    }

    get type(): BarType {
        return this._type;
    }

    public updateValue(value: number): void {
        if (value === 1) {
            delayRunnable(0.7, () => {
                this.animateValue(value);
            });
        } else {
            this.animateValue(value);
        }
    }

    private animateValue(value: number): void {
        this.value = Math.min(value, BAR_MAX);
        const newWidth = this.progressBar.width * (this.value / BAR_MAX);
        this.progressBar.tint = BAR_TINT[this.value];
        anime({
            targets: this.maskGr,
            width: newWidth,
            duration: 1000,
            easing: 'easeInOutSine',
            update: () => {
                this.maskGr.x = -this.progressBar.width / 2 + this.progressBar.x;
            },
        });

        const scale = value < +this.valueText.text ? 0.8 : 1.2;
        this.valueText.text = `${value}`;

        anime({
            targets: this.valueText.scale,
            x: scale,
            y: scale,
            duration: 100,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: 1,
            complete: () => {
                this.valueText.scale.set(1);
            },
        });
    }

    private build(): void {
        this.progressBkg = makeSprite({ texture: Images['game/progress_bkg'], anchor: new Point(0.5) });

        this.icon = makeSprite({ texture: this.getIconTexture(), anchor: new Point(0.5) });
        this.icon.position.set(-80, -25);

        this.valueText = new Text('1000', { fontSize: 28, fill: 0xffffff });
        this.valueText.anchor.set(0.5);
        this.valueText.position.set(25, 18);

        this.progressBar = makeSprite({ texture: Images['game/progress_bar'], anchor: new Point(0.5) });
        this.progressBar.position.set(25, 3);
        this.progressBar.scale.x = 0.925;
        this.progressBar.tint = 0x01dd55;
        const { width: w, height: h, x, y } = this.progressBar;

        this.maskGr = new Graphics();
        this.maskGr.beginFill(0xffffff);
        this.maskGr.drawRect(0, 0, w, h + 10);
        this.maskGr.endFill();

        this.progressBar.mask = this.maskGr;

        this.addChild(this.progressBkg, this.progressBar, this.maskGr, this.valueText, this.icon);
    }

    private getIconTexture(): string {
        let texture = '';

        switch (this.type) {
            case BarType.Health:
                texture = Images['game/health_icon'];
                break;
            case BarType.Food:
                texture = Images['game/food_icon'];
                break;
            case BarType.Joy:
                texture = Images['game/joy_icon'];
                break;

            default:
                break;
        }
        return texture;
    }
}
