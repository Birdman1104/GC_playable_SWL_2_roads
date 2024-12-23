import { lego } from '@armathai/lego';
import { Container, Point, Text } from 'pixi.js';
import { Images } from '../assets';
import { BottomBarEvents } from '../events/MainEvents';
import { ButtonModel, ButtonType } from '../models/ButtonModel';
import { makeSprite } from '../utils';

export class Button extends Container {
    private _type: ButtonType;
    private _price: number;
    private priceText: Text;
    private _isActive: boolean;

    constructor(private config: ButtonModel) {
        super();

        this._type = config.type;
        this._price = config.price;
        this._isActive = config.isActive;

        const sprite = makeSprite(getSpriteConfig(this._type));
        sprite.interactive = true;

        sprite.on('pointerdown', () => {
            lego.event.emit(BottomBarEvents.ButtonClicked, this._type, this._price);
        });
        this.addChild(sprite);

        this.priceText = new Text(`${this._price}`, { fill: 0x665d5a, fontSize: 36, fontFamily: 'MyCustomFont' });
        this.priceText.anchor.set(0, 0.5);
        this.priceText.position.set(-8, 72);
        this.addChild(this.priceText);
    }

    get uuid(): string {
        return this.config.uuid;
    }

    get type(): string {
        return this._type;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get hintPosition(): Point {
        return new Point(this.x + 50, this.y + 30);
    }

    public updatePrice(newPrice: number): void {
        this._price = newPrice;
        this.priceText.text = `${this._price}`;
    }

    public activate(): void {
        this._isActive = true;
        this.alpha = 1;
    }

    public deactivate(): void {
        this._isActive = false;
        this.alpha = 0.7;
    }
}

const getSpriteConfig = (type: ButtonType): { texture: string } => {
    switch (type) {
        case ButtonType.Food:
            return { texture: Images['game/buy_cafe'] };
        case ButtonType.Joy:
            return { texture: Images['game/buy_park'] };
        case ButtonType.Health:
            return { texture: Images['game/buy_hospital'] };
        case ButtonType.House:
            return { texture: Images['game/buy_house'] };

        default:
            break;
    }

    return { texture: '' };
};
