import { Container, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

export class Car extends Container {
    private car: Sprite;

    constructor(private _type: string, private _direction: string) {
        super();

        this.build();
    }

    get type(): string {
        return this._type;
    }

    public updateTexture(direction: string): void {
        this._direction = direction;
        this.car.texture = Texture.from(Images[`cars-${this._direction}/${this._type}`]);
    }

    private build(): void {
        this.car = makeSprite({ texture: Images[`cars-${this._direction}/${this._type}`] });
        this.car.anchor.set(0.5);
        this.car.scale.set(this._type === 'bus' ? 0.2 : 0.25);
        this.addChild(this.car);
    }
}
