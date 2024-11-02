import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { getUIGridConfig } from '../configs/gridConfigs/UIViewGC';
import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

export class UIView extends PixiGrid {
    private topBar: TopBar;
    private bottomBar: BottomBar;

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
        this.buildBottomBar();
    }

    private buildTopBar(): void {
        this.topBar = new TopBar();
        this.setChild('topBar', this.topBar);
    }

    private buildBottomBar(): void {
        this.bottomBar = new BottomBar();
        this.bottomBar.on('rebuild', this.rebuild, this)
        this.setChild('bottomBar', this.bottomBar);
    }
}
