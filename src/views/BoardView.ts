import { lego } from '@armathai/lego';
import { Container, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { BoardEvents } from '../events/MainEvents';
import { AreaModelEvents, BoardModelEvents, GameModelEvents } from '../events/ModelEvents';
import { AreaModel, BuildingType } from '../models/AreaModel';
import { GameState } from '../models/GameModel';
import { delayRunnable, isNarrowScreen, isSquareLikeScreen, lp, makeSprite } from '../utils';
import { Area } from './Area';

const BOUNDS = {
    landscape: { x: -400, y: -450, width: 800, height: 800 },
    portrait: { x: -550, y: -400, width: 1000, height: 600 },

    portraitSquare: { x: -550, y: -400, width: 1000, height: 700 },
    landscapeSquare: { x: -450, y: -450, width: 800, height: 900 },

    portraitNarrow: { x: -550, y: -400, width: 1000, height: 700 },
    landscapeNarrow: { x: -400, y: -380, width: 800, height: 700 },
};
export class BoardView extends Container {
    private bkg: Sprite;
    private areas: Area[] = [];

    constructor() {
        super();

        lego.event
            .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this)
            .on(BoardModelEvents.AreasUpdate, this.onAreasUpdate, this)
            .on(AreaModelEvents.BuildingUpdate, this.onAreaBuildingUpdate, this)
            .on(BoardModelEvents.CoinsUpdate, this.onCoinsUpdate, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    get houseAreas() {
        return this.areas.filter((area) => area.buildingType === BuildingType.House);
    }

    public getBuildingByUuid(uuid: string): Area | undefined {
        return this.areas.find((area) => area.uuid === uuid);
    }

    public getBounds(skipUpdate?: boolean | undefined, rect?: Rectangle | undefined): Rectangle {
        let bounds = BOUNDS.landscape;
        if (isSquareLikeScreen()) {
            bounds = lp(BOUNDS.landscapeSquare, BOUNDS.portraitSquare);
        } else if (isNarrowScreen()) {
            bounds = lp(BOUNDS.landscapeNarrow, BOUNDS.portraitNarrow);
        } else {
            bounds = lp(BOUNDS.landscape, BOUNDS.portrait);
        }

        const { x, y, width, height } = bounds;
        return new Rectangle(x, y, width, height);
    }

    public rebuild(): void {
        //
    }

    private build(): void {
        this.buildBkg();
    }

    private onAreasUpdate(areas: AreaModel[]): void {
        this.areas = areas.map((a) => {
            const area = new Area(a);
            area.on('animationComplete', () => {
                delayRunnable(0.3, () => lego.event.emit(BoardEvents.HouseAnimationComplete));
            });
            area.position.set(a.x, a.y);
            this.addChild(area);
            return area;
        });
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }

    private onAreaBuildingUpdate(newBuilding: BuildingType, oldBuilding: BuildingType, uuid): void {
        const area = this.getBuildingByUuid(uuid);
        if (!area) return;

        area.addBuilding(newBuilding);
    }

    private onCoinsUpdate(): void {
        this.houseAreas.forEach((area) => area.playCoinsAnimation());
    }

    private buildBkg(): void {
        this.bkg?.destroy();

        this.bkg = makeSprite({ texture: Images['game/bkg'] });
        this.bkg.interactive = true;
        this.bkg.on('pointerdown', () => lego.event.emit(BoardEvents.BkgPointerDown));
        this.bkg.y = 28;
        const scale = 1857 / this.bkg.width;
        this.bkg.scale.set(scale);
        this.addChild(this.bkg);
    }
}
