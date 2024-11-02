import { AdStatus } from '../models/AdModel';
import { AreaType } from '../models/AreaModel';
import { BoardState } from '../models/BoardModel';
import Head from '../models/HeadModel';
import { GAME_CONFIG } from './GameConfig';

export const hintParamGuard = (): boolean => {
    return GAME_CONFIG.Hint;
};

export const hintModelGuard = (): boolean => {
    return !!Head.ad?.hint;
};

export const soundParamGuard = (): boolean => {
    return GAME_CONFIG.Sound;
};

export const soundModelGuard = (): boolean => {
    return !!Head.ad?.sound;
};

export const ctaModelGuard = (): boolean => {
    return !!Head.ad?.cta;
};

export const ctaVisibleGuard = (): boolean => {
    return !!Head.ad?.cta?.visible;
};

export const adStatusCtaGuard = (): boolean => {
    return Head.ad?.status === AdStatus.Cta;
};

export const gameModelGuard = (): boolean => {
    return !!Head.gameModel;
};

export const isTutorialModeGuard = (): boolean => {
    return !!Head.gameModel?.isTutorial;
};

export const hasEnoughMoneyGuard = (price: number): boolean => {
    if (!Head.gameModel?.board) return false;
    const { coins } = Head.gameModel?.board;
    if (!coins) return false;
    return coins >= price;
};

export const boardModelStateSecondSceneGuard = (): boolean => {
    return Head.gameModel?.board?.state === BoardState.SecondScene
};

export const boardModelStateFirstSceneGuard = (): boolean => {
    return Head.gameModel?.board?.state === BoardState.FirstScene
};

export const boardModelStateIdleGuard = (): boolean => {
    return Head.gameModel?.board?.state === BoardState.Idle
};

export const boardModelStateGameGuard = (): boolean => {
    return Head.gameModel?.board?.state === BoardState.Game
};

export const hasEmptySquareArea = (): boolean => {
    return !!Head.gameModel?.board?.areas.find(area => !area.building && area.type === AreaType.Square);
};

export const hasEmptyRectangleArea = (): boolean => {
    return !!Head.gameModel?.board?.areas.find(area => !area.building && area.type === AreaType.Rectangle);
};

export const isLastBuildingGuard = (): boolean => {
    return !!Head.gameModel?.board?.isLastFreeArea()
};
