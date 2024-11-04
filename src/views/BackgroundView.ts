import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { Sprite } from 'pixi.js';
import { Images } from '../assets';
import { getBackgroundGridConfig } from '../configs/gridConfigs/BackgroundViewGC';
import { AdModelEvents } from '../events/ModelEvents';
import { AdStatus } from '../models/AdModel';
import { makeSprite } from '../utils';

export class BackgroundView extends PixiGrid {
    private bkg: Sprite;
    constructor() {
        super();

        lego.event.on(AdModelEvents.StatusUpdate, this.onStatusUpdate, this);
        this.buildBkg('bkg/grass');
    }

    public getGridConfig(): ICellConfig {
        return getBackgroundGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private onStatusUpdate(status: AdStatus): void {
        switch (status) {
            case AdStatus.Game:
                break;
            default:
        }
    }

    private buildBkg(texture: string): void {
        this.bkg?.destroy();

        this.bkg = makeSprite({ texture: Images[texture] });
        this.setChild('sprite', this.bkg);
    }
}
