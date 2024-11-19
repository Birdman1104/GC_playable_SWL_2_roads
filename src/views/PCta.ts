import { lego } from '@armathai/lego';
import { Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { TakeMe } from '../events/MainEvents';

export class PCta extends Sprite {
    constructor() {
        super(Texture.from(Images['game/install']));

        this.scale.set(94 / this.height);

        this.interactive = true;

        this.on('pointerdown', () => lego.event.emit(TakeMe.ToStore));
    }
}
