import { lego } from '@armathai/lego';
import { Container, Point, Rectangle } from 'pixi.js';
import { BoardModelEvents, ButtonModelEvents } from '../events/ModelEvents';
import { ButtonModel, ButtonType } from '../models/ButtonModel';
import { Button } from './Button';

export class BottomBar extends Container {
    private buttons: Button[] = [];

    constructor() {
        super();

        lego.event
            .on(BoardModelEvents.ButtonsUpdate, this.onButtonsUpdate, this)
            .on(ButtonModelEvents.PriceUpdate, this.onButtonPriceUpdate, this)
            .on(ButtonModelEvents.IsActiveUpdate, this.onButtonActiveUpdate, this);
        this.build();
    }

    get viewName() {
        return 'BottomBar';
    }

    public getBounds(): Rectangle {
        return new Rectangle(-10, 0, 840, 220);
    }

    public getOtherButtonsHintPositions(): Point[] {
        const otherButtons = this.buttons.filter((b) => b.type !== ButtonType.House);
        const hintPositions = otherButtons.map((b) => this.toGlobal(b.hintPosition));
        return hintPositions;
    }

    public getActiveButtonsHintPositions(): Point[] {
        const activeButtons = this.buttons.filter((b) => b.isActive);
        const hintPositions = activeButtons.map((b) => this.toGlobal(b.hintPosition));
        return hintPositions;
    }

    public getHouseButtonPosition(): Point[] {
        const housePosition = this.buttons.find((b) => b.type === ButtonType.House);
        return housePosition ? [this.toGlobal(housePosition.hintPosition)] : [];
    }

    private build(): void {
        //
    }

    private onButtonsUpdate(buttons: ButtonModel[]): void {
        this.buttons = buttons.map((c, i) => {
            const button = new Button(c);
            button.position.set(button.width / 2 + button.width * i * 1.2, button.height / 2);
            this.addChild(button);
            return button;
        });

        this.emit('rebuild');
    }

    private onButtonActiveUpdate(isActive: boolean, wasActive: boolean, uuid: string): void {
        const button = this.buttons.find((b) => b.uuid === uuid);
        if (!button) return;

        isActive ? button.activate() : button.deactivate();
    }

    private onButtonPriceUpdate(newPrice: number, oldPrice: number, uuid: string): void {
        const button = this.buttons.find((b) => b.uuid === uuid);
        if (!button) return;

        button.updatePrice(newPrice);
    }
}
