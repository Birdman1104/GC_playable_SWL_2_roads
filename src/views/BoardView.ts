import { lego } from '@armathai/lego';
import { Container, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { PATHS } from '../configs/Paths';
import { TREES } from '../configs/TreesConfig';
import { BoardEvents } from '../events/MainEvents';
import { AreaModelEvents, BoardModelEvents } from '../events/ModelEvents';
import { AreaModel, BuildingType } from '../models/AreaModel';
import { delayRunnable, isNarrowScreen, isSquareLikeScreen, lp, makeSprite, sample } from '../utils';
import { Area } from './Area';
import { CarPath } from './CarPath';

const BOUNDS = {
    landscape: { x: -400, y: -450, width: 800, height: 800 },
    portrait: { x: -550, y: -400, width: 1000, height: 600 },

    landscapeSquare: { x: -450, y: -450, width: 800, height: 900 },
    portraitSquare: { x: -550, y: -400, width: 1000, height: 700 },

    portraitNarrow: { x: -550, y: -400, width: 1000, height: 700 },
    landscapeNarrow: { x: -400, y: -380, width: 800, height: 700 },
};

export class BoardView extends Container {
    private bkg: Sprite;
    private carPaths: CarPath[] = [];
    private areas: Area[] = [];

    constructor() {
        super();

        lego.event
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

    public getBounds(): Rectangle {
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

        this.buildCarPaths();
    }

    private buildCarPaths(): void {
        this.carPaths = PATHS.map((path, i) => {
            const carPath = new CarPath(path);
            this.addChild(carPath);
            return carPath;
        });
    }

    private onAreaBuildingUpdate(newBuilding: BuildingType, oldBuilding: BuildingType, uuid): void {
        const area = this.getBuildingByUuid(uuid);
        if (!area) return;
        this.removeChild(area);
        this.addChild(area);
        area.addBuilding(newBuilding);

        this.moveCar();
    }

    private moveCar(): void {
        const road = sample(this.carPaths);
        road.move();
    }

    private onCoinsUpdate(): void {
        this.houseAreas.forEach((area) => area.playCoinsAnimation());
    }

    private buildBkg(): void {
        this.bkg?.destroy();

        this.bkg = makeSprite({ texture: Images['bkg/road'] });
        this.bkg.interactive = true;
        this.bkg.on('pointerdown', () => {
            lego.event.emit(BoardEvents.BkgPointerDown);
        });
        this.bkg.y = 28;
        const scale = 1857 / this.bkg.width;
        this.bkg.scale.set(scale);
        this.addChild(this.bkg);

        TREES.forEach(({ x, y, scale = 1 }) => {
            const tree = makeSprite({ texture: Images['bkg/tree'] });
            tree.position.set(x, y);
            tree.scale.set(scale);
            this.addChild(tree);
        });
    }
}
