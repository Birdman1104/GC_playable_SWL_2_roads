import { ObservableModel } from './ObservableModel';

export enum BuildingType {
    House = 'house',
    Hospital = 'hospital',
    Food = 'food',
    FortuneWheel = 'fortune_wheel',
    WinterFountain = 'winter_fountain',
    None = 'none',
}

export enum AreaType {
    Square = 'square',
    Rectangle = 'rectangle',
}

export class AreaModel extends ObservableModel {
    private _building: BuildingType;
    private _type: AreaType;

    constructor(private config: AreaConfig) {
        super('AreaModel');

        this.makeObservable();
    }

    public get x(): number {
        return this.config.x;
    }

    public get y(): number {
        return this.config.y;
    }

    public get type(): AreaType {
        return this._type;
    }

    public get building(): BuildingType {
        return this._building;
    }

    public set building(value: BuildingType) {
        this._building = value;
    }

    public initialize(): void {
        this.config.building && (this.building = this.config.building);
        this._type = this.config.type;
    }

    public addBuilding(building: BuildingType): void {
        this._building = building;
    }
}
