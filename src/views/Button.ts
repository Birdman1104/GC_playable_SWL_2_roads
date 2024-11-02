import { lego } from '@armathai/lego';
import { Container } from 'pixi.js';
import { Images } from '../assets';
import { BottomBarEvents } from '../events/MainEvents';
import { ButtonModel, ButtonType } from '../models/ButtonModel';
import { makeSprite } from '../utils';

const SCALE = 0.5;

export class Button extends Container {
    private _type: ButtonType;
    private _price: number;
    private _isActive: boolean;

    constructor(private config: ButtonModel) {
        super();

        this._type = config.type;
        this._price = config.price;
        this._isActive = config.isActive;

        const sprite = makeSprite(getSpriteConfig(this._type));
        sprite.interactive = true;
        this.scale.set(SCALE);

        sprite.on('pointerdown', () => {
            lego.event.emit(BottomBarEvents.ButtonClicked, this._type, this._price);
        });
        this.addChild(sprite);
    }

    get uuid(): string {
        return this.config.uuid;
    }

    get type(): string {
        return this._type;
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
