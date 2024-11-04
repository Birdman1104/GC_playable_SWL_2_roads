import { lego } from '@armathai/lego';
import { Container, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { SoundEvents } from '../events/MainEvents';
import { makeSprite } from '../utils';

export class Sound extends Container {
    private isMuted = false;
    private icon: Sprite;

    constructor() {
        super();

        this.build();
    }

    private build(): void {
        this.icon = makeSprite({ texture: Images['game/sound_on'] });

        this.icon.interactive = true;
        this.icon.on('pointerdown', this.onPointerDown, this);
        this.addChild(this.icon);
    }

    private onPointerDown(): void {
        lego.event.emit(this.isMuted ? SoundEvents.Unmute : SoundEvents.Mute);
        this.isMuted = !this.isMuted;
        this.icon.texture = Texture.from(Images[`game/sound_${this.isMuted ? 'off' : 'on'}`]);
    }
}
