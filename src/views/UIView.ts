import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { getUIGridConfig } from '../configs/gridConfigs/UIViewGC';
import { TopBar } from './TopBar';

export class UIView extends PixiGrid {
    private topBar: TopBar;

    constructor() {
        super();

        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getUIGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        this.buildTopBar();
    }

    private buildTopBar(): void {
        this.topBar = new TopBar();
        this.setChild('topBar', this.topBar);
    }
}
