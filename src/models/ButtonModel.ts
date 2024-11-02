import { ObservableModel } from './ObservableModel';

export enum ButtonType {
    House = 'house',
    Health = 'health',
    Food = 'food',
    Joy = 'joy',
}

export class ButtonModel extends ObservableModel {
    private _type: ButtonType;
    private _price: number;
    private _isActive = true;

    constructor({ type, price }) {
        super('ButtonModel');

        this._type = type;
        this._price = price;

        this.makeObservable();
    }

    get type(): ButtonType {
        return this._type;
    }

    set type(value: ButtonType) {
        this._type = value;
    }

    get price(): number {
        return this._price;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }
}
