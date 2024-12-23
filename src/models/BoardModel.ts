import { AREAS } from '../configs/AreasConfig';
import { BUTTONS_CONFIG } from '../configs/ButtonsConfig';
import { GAME_CONFIG } from '../configs/GameConfig';
import { delayRunnable } from '../utils';
import { AreaModel, AreaType, BuildingType } from './AreaModel';
import { ButtonModel, ButtonType } from './ButtonModel';
import { ObservableModel } from './ObservableModel';

export enum BoardState {
    FirstScene = 'first_scene', // 'build a house', only house button
    Idle = 'idle', // 'Provide for citizens', other buttons
    SecondScene = 'second_scene', // 'Provide for citizens', other buttons
    Game = 'game',
    Win = 'win',
}

// TODO - bring back values
const INITIAL_COINS = 1000;
const INITIAL_HEALTH = 5;
const INITIAL_FOOD = 2;
const INITIAL_JOY = 3;

const COEFFICIENT = {
    [BuildingType.Food]: 2,
    [BuildingType.WinterFountain]: 1.8,
    [BuildingType.Hospital]: 2.5,
};
export class BoardModel extends ObservableModel {
    private _coins: number;
    private _health: number;
    private _food: number;
    private _joy: number;
    private _buttons: ButtonModel[] = [];
    private _state: BoardState;

    private _areas: AreaModel[] = [];

    constructor() {
        super('BoardModel');

        this.makeObservable();
    }

    public get coefficient(): number {
        let result = 1;
        this.areas.forEach((a) => {
            if (a.building) {
                result *= COEFFICIENT[a.building] || 1;
            }
        });
        return result;
    }

    public get state(): BoardState {
        return this._state;
    }

    public set state(value: BoardState) {
        this._state = value;
    }

    public get coins(): number {
        return this._coins;
    }

    public set coins(value: number) {
        this._coins = value;
    }

    public get health(): number {
        return this._health;
    }

    public get food(): number {
        return this._food;
    }

    public get joy(): number {
        return this._joy;
    }

    public set health(value: number) {
        this._health = value;
    }

    public set food(value: number) {
        this._food = value;
    }

    public set joy(value: number) {
        this._joy = value;
    }

    public get areas(): AreaModel[] {
        return this._areas;
    }

    public set areas(value: AreaModel[]) {
        this._areas = value;
    }

    public get buttons(): ButtonModel[] {
        return this._buttons;
    }

    public set buttons(value: ButtonModel[]) {
        this._buttons = value;
    }

    public getFreeAreaByType(type: AreaType): AreaModel | undefined {
        const freeAreas = this.areas.filter((area) => area.type === type && !area.building);
        const rnd = Math.floor(Math.random() * freeAreas.length);
        return freeAreas.length === 0 ? undefined : freeAreas[rnd];
    }

    public isBuildingCountReached(): boolean {
        const freeAreas = this.areas.filter((area) => !area.building);
        return freeAreas.length === 6;
    }

    public setState(state: BoardState): void {
        this.state = state;
    }

    public increaseHousePrice(): void {
        this._buttons.find((b) => b.type === ButtonType.House)?.increasePrice(500);
    }

    public disableNonHouseButtons(): void {
        this.buttons.forEach((b) => (b.isActive = b.type === ButtonType.House));
    }

    public disableAllButtons(): void {
        this.buttons.forEach((b) => (b.isActive = false));
    }

    public enableNonHouseButtons(): void {
        this.buttons.forEach((b) => (b.isActive = b.type !== ButtonType.House));
    }

    public enableAllButtons(): void {
        this.buttons.forEach((b) => (b.isActive = this._coins >= b.price));
    }

    public addCoins(value: number): void {
        this._coins += value;
        this.checkButtonsActive();
    }

    public addHealth(value: number): void {
        this._health += value;
    }

    public addFood(value: number): void {
        this._food += value;
    }

    public addJoy(value: number): void {
        this._joy += value;
    }

    public decreaseCoins(value: number): void {
        this._coins -= value;

        this.checkButtonsActive();
    }

    public decreaseHealth(value: number): void {
        const newValue = this._health - value;
        this._health = Math.max(newValue, 0);
    }

    public decreaseFood(value: number): void {
        const newValue = this._food - value;
        this._food = Math.max(newValue, 0);
    }

    public decreaseJoy(value: number): void {
        const newValue = this._joy - value;
        this._joy = Math.max(newValue, 0);
    }

    public addBuilding(building: BuildingType): void {
        const areaType = getAreaType(building);
        const area = this.getFreeAreaByType(areaType);
        if (!area) return;

        area.addBuilding(building);

        // if(this.state !== BoardState.Game) return;

        switch (building) {
            case BuildingType.House:
                this.decreaseJoy(1);
                this.decreaseFood(1);
                this.decreaseHealth(1);
                break;
            case BuildingType.Hospital:
                this.addHealth(5);
                break;
            case BuildingType.Food:
                this.addFood(2);
                break;
            case BuildingType.WinterFountain:
                this.addJoy(3);
                break;

            default:
                break;
        }
    }

    public startMoneyGenerationLoop(): void {
        if (this.state === BoardState.Game || this.state === BoardState.SecondScene || this.state === BoardState.Win) {
            delayRunnable(GAME_CONFIG.MoneyGenerationInterval, () => this.collectCoins());
        }
    }

    public initialize(): void {
        this.areas = AREAS.map((area) => {
            const areaModel = new AreaModel(area);
            areaModel.initialize();
            return areaModel;
        });

        this._buttons = BUTTONS_CONFIG.map((c) => {
            const buttonModel = new ButtonModel(c);
            buttonModel.initialize();
            return buttonModel;
        });

        this._coins = INITIAL_COINS;
        this._health = INITIAL_HEALTH;
        this._food = INITIAL_FOOD;
        this._joy = INITIAL_JOY;
    }

    private checkButtonsActive(): void {
        if (this.state === BoardState.Game || this.state === BoardState.Win) {
            for (let i = 0; i < this.buttons.length; i++) {
                const b = this.buttons[i];
                b.isActive = b.price <= this._coins;
                if (!b.isActive) continue;
                if (b.type === ButtonType.House || b.type === ButtonType.Joy) {
                    const emptyAreas = this.areas.filter((a) => !a.building && a.type === AreaType.Square);
                    b.isActive = emptyAreas.length > 0;
                } else if (b.type === ButtonType.Food || b.type === ButtonType.Health) {
                    const emptyAreas = this.areas.filter((a) => !a.building && a.type === AreaType.Rectangle);
                    b.isActive = emptyAreas.length > 0;
                }
            }
        }
    }

    private collectCoins(): void {
        if (this.coins > 99999) return;
        const housesCount = this.areas.filter((a) => a.building === BuildingType.House).length;
        if (!housesCount) return;

        this.addCoins(housesCount * GAME_CONFIG.HouseCoinsGeneration * this.coefficient);

        this.startMoneyGenerationLoop();
    }
}

const getAreaType = (building: BuildingType): AreaType => {
    switch (building) {
        case BuildingType.House:
        case BuildingType.WinterFountain:
            return AreaType.Square;
        case BuildingType.Food:
        case BuildingType.FortuneWheel:
        case BuildingType.Hospital:
            return AreaType.Rectangle;
        default:
            return AreaType.Square;
    }
};
