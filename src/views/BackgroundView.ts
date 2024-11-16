import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { Sprite } from 'pixi.js';
import { Images } from '../assets';
import { getBackgroundGridConfig } from '../configs/gridConfigs/BackgroundViewGC';
import { makeSprite } from '../utils';

export class BackgroundView extends PixiGrid {
    private bkg: Sprite;
    constructor() {
        super();

        this.buildBkg('bkg/grass');
    }

    public getGridConfig(): ICellConfig {
        return getBackgroundGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private buildBkg(texture: string): void {
        this.bkg?.destroy();

        this.bkg = makeSprite({ texture: Images[texture] });
        this.setChild('sprite', this.bkg);
    }
}
