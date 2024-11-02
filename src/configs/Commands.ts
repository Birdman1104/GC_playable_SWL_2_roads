import { lego } from '@armathai/lego';
import { AdStatus } from '../models/AdModel';
import { BuildingType } from '../models/AreaModel';
import { BoardState } from '../models/BoardModel';
import { ButtonType } from '../models/ButtonModel';
import { GameState } from '../models/GameModel';
import Head from '../models/HeadModel';
import { HintState } from '../models/HintModel';
import { unMapCommands } from './EventCommandPairs';
import {
    boardModelStateFirstSceneGuard,
    boardModelStateGameGuard,
    boardModelStateIdleGuard,
    boardModelStateSecondSceneGuard,
    hasEmptyRectangleArea,
    hasEmptySquareArea,
    hasEnoughMoneyGuard,
    hintModelGuard,
    hintParamGuard,
    isLastBuildingGuard,
    soundParamGuard,
} from './Guards';

export const initAdModelCommand = (): void => Head.initializeADModel();

export const onMainViewReadyCommand = (): void => {
    lego.command
        //
        .execute(initAdModelCommand)

        .payload(AdStatus.Game)
        .execute(setAdStatusCommand);
};

const initializeGameModelCommand = (): void => Head.initializeGameModel();
const initializeCtaModelCommand = (): void => Head.ad?.initializeCtaModel();
const initializeSoundModelCommand = (): void => Head.ad?.initializeSoundModel();
const initializeHintModelCommand = (): void => Head.ad?.initializeHintModel();

const setHintStateCommand = (state: HintState): void => Head.ad?.hint?.setState(state);
const startHintVisibilityTimerCommand = (time?: number): void => Head.ad?.hint?.startVisibilityTimer(time);
const stopHintVisibilityTimerCommand = (): void => Head.ad?.hint?.stopVisibilityTimer();

const initializeModelsCommand = (): void => {
    lego.command

        .execute(initializeGameModelCommand)

        .execute(initializeCtaModelCommand)

        .guard(soundParamGuard)
        .execute(initializeSoundModelCommand)

        .guard(hintParamGuard)
        .execute(initializeHintModelCommand)

        .guard(hintParamGuard)
        .execute(startHintVisibilityTimerCommand);
};

const hideHintCommand = (): void => {
    lego.command.payload(false).execute(setHintVisibleCommand);
};

const setHintVisibleCommand = (value: boolean): void => {
    Head.ad?.hint?.setVisibility(value);
};

const destroyGameModelCommand = (): void => Head.destroyGameModel();
const destroyCtaModelCommand = (): void => Head.ad?.destroyCtaModel();
const destroySoundModelCommand = (): void => Head.ad?.destroySoundModel();
const destroyHintModelCommand = (): void => Head.ad?.destroyHintModel();
const setAdStatusCommand = (status: AdStatus): void => Head.ad?.setAdStatus(status);

export const buyFoodCommand = (price: number) => {
    lego.command
        //
        .guard(hasEmptyRectangleArea)
        .payload(price)
        .execute(decreaseCoinsCommand)

        .guard(hasEmptyRectangleArea)
        .payload(BuildingType.Food)
        .execute(addBuildingCommand);
};

export const buyHospitalCommand = (price: number) => {
    lego.command
        //
        .guard(hasEmptyRectangleArea)
        .payload(price)
        .execute(decreaseCoinsCommand)

        .guard(hasEmptyRectangleArea)
        .payload(BuildingType.Hospital)
        .execute(addBuildingCommand);
};

export const buyHouseCommand = (price: number) => {
    lego.command
        //
        .guard(hasEmptySquareArea)
        .payload(price)
        .execute(decreaseCoinsCommand)

        .guard(hasEmptySquareArea)
        .payload(BuildingType.House)
        .execute(addBuildingCommand);
};

export const buyJoyCommand = (price: number) => {
    lego.command
        //
        .guard(hasEmptySquareArea)
        .payload(price)
        .execute(decreaseCoinsCommand)

        .guard(hasEmptySquareArea)
        .payload(BuildingType.WinterFountain)
        .execute(addBuildingCommand);
};

export const onBuyButtonClickedCommand = (buttonType: ButtonType, price: number): void => {
    if (!hasEnoughMoneyGuard(price)) {
        lego.command
            .payload(AdStatus.Cta)
            .execute(setAdStatusCommand)

            .execute(takeToStoreCommand);
        return;
    }

    lego.command
        .guard(isLastBuildingGuard)
        .execute(takeToStoreCommand)

        .guard(isLastBuildingGuard)
        .payload(AdStatus.Cta)
        .execute(setAdStatusCommand)

        .guard(lego.not(isLastBuildingGuard), hasEnoughMoneyGuard)
        .payload(price, buttonType)
        .execute(processBuyActionsCommand);
};

const decreaseCoinsCommand = (price: number): void => {
    Head.gameModel?.board?.decreaseCoins(price);
};

const processBuyActionsCommand = (price: number, buttonType: ButtonType): void => {
    switch (buttonType) {
        case ButtonType.Food:
            lego.command
                .payload(price)
                .guard(boardModelStateSecondSceneGuard)
                .execute(buyFoodCommand)

                .payload(price)
                .guard(boardModelStateGameGuard)
                .execute(buyFoodCommand)

                .guard(boardModelStateSecondSceneGuard)
                .payload(BoardState.Game)
                .execute(setBoardStateCommand);

            break;
        case ButtonType.Health:
            lego.command
                .payload(price)
                .guard(boardModelStateSecondSceneGuard)
                .execute(buyHospitalCommand)

                .payload(price)
                .guard(boardModelStateGameGuard)
                .execute(buyHospitalCommand)

                .guard(boardModelStateSecondSceneGuard)
                .payload(BoardState.Game)
                .execute(setBoardStateCommand);
            break;
        case ButtonType.House:
            lego.command
                .guard(boardModelStateFirstSceneGuard)
                .execute(disableAllButtonsCommand)

                .payload(price)
                .guard(boardModelStateFirstSceneGuard)
                .execute(buyHouseCommand)

                .guard(boardModelStateFirstSceneGuard)
                .payload(BoardState.Idle)
                .execute(setBoardStateCommand)

                .guard(boardModelStateFirstSceneGuard, hintModelGuard)
                .execute(hideHintCommand)

                .guard(boardModelStateFirstSceneGuard, hintModelGuard)
                .execute(stopHintVisibilityTimerCommand)

                .payload(price)
                .guard(boardModelStateGameGuard)
                .execute(buyHouseCommand);
            break;
        case ButtonType.Joy:
            lego.command
                .payload(price)
                .guard(boardModelStateSecondSceneGuard)
                .execute(buyJoyCommand)

                .payload(price)
                .guard(boardModelStateGameGuard)
                .execute(buyJoyCommand)

                .guard(boardModelStateSecondSceneGuard)
                .payload(BoardState.Game)
                .execute(setBoardStateCommand);
            break;

        default:
            break;
    }
};

export const onHouseAnimationCompleteCommand = (): void => {
    lego.command
        //
        .guard(boardModelStateIdleGuard)
        .payload(BoardState.SecondScene)
        .execute(setBoardStateCommand);
};

export const onBoardStateUpdateCommand = (state: BoardState): void => {
    switch (state) {
        case BoardState.FirstScene:
            lego.command
                //
                .execute(disableNonHouseButtonsCommand)

                .execute(restartHintCommand);
            break;
        case BoardState.Idle:
            lego.command
                //
                .guard(hintModelGuard)
                .execute(hideHintCommand);
            break;
        case BoardState.SecondScene:
            lego.command
                //
                .execute(enableNonHouseButtonsCommand)
                .execute(restartHintCommand)

                .execute(startMoneyGeneratorLoopCommand);
            break;
        case BoardState.Game:
            lego.command
                //
                .execute(enableAllButtonsCommand)
                .execute(turnOffTutorialModeCommand)

                .guard(hintModelGuard)
                .execute(hideHintCommand)

                .guard(hintModelGuard)
                .execute(destroyHintModelCommand);

            break;
        case BoardState.Fail:
            lego.command
                //
                .payload(AdStatus.Cta)
                .execute(setAdStatusCommand);
            break;
        default:
            break;
    }
};

const startMoneyGeneratorLoopCommand = (): void => {
    Head.gameModel?.board?.startMoneyGenerationLoop();
};

const disableNonHouseButtonsCommand = (): void => {
    Head.gameModel?.board?.disableNonHouseButtons();
};

const disableAllButtonsCommand = (): void => {
    Head.gameModel?.board?.disableAllButtons();
};

const enableNonHouseButtonsCommand = (): void => {
    Head.gameModel?.board?.enableNonHouseButtons();
};

const enableAllButtonsCommand = (): void => {
    Head.gameModel?.board?.enableAllButtons();
};

export const addBuildingCommand = (building: BuildingType): void => {
    Head.gameModel?.board?.addBuilding(building);
};

export const onAdStatusUpdateCommand = (status: AdStatus): void => {
    switch (status) {
        case AdStatus.Game:
            lego.command
                //
                .execute(initializeModelsCommand);

            break;
        case AdStatus.PreCta:
            lego.command
                //
                .execute(unMapCommands)

                .guard(hintModelGuard)
                .execute(destroyHintModelCommand);
            break;
        case AdStatus.Cta:
            // lego.command.guard(gameModelGuard).execute(destroyGameModelCommand);
            lego.command
                //
                .execute(showCtaCommand)

                .payload(BoardState.Win)
                .execute(setBoardStateCommand);

            break;
        default:
            break;
    }
};

const setGameStateCommand = (state: GameState): void => Head.gameModel?.setState(state);
const setBoardStateCommand = (state: BoardState): void => Head.gameModel?.board?.setState(state);
const showCtaCommand = (): void => Head.ad?.cta?.show();

const turnOffTutorialModeCommand = (): void => Head.gameModel?.turnOffTutorialMode();

export const onGameStateUpdateCommand = (state: GameState): void => {
    switch (state) {
        case GameState.Idle:
            //
            break;

        default:
            break;
    }
};

export const restartHintCommand = (): void => {
    lego.command
        //
        .guard(hintModelGuard)
        .execute(hideHintCommand)

        .guard(hintModelGuard)
        .execute(stopHintVisibilityTimerCommand)

        .guard(hintModelGuard)
        .execute(startHintVisibilityTimerCommand);
};

export const resizeCommand = (): void => {
    lego.command.execute(restartHintCommand);
};

export const takeToStoreCommand = (): void => {
    if (!window.installCTA) {
        window.CTACallImitation && window.CTACallImitation();
    } else {
        window.installCTA();
    }
};
