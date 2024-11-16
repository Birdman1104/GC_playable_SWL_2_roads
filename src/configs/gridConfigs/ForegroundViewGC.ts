import { CellAlign, CellScale } from '@armathai/pixi-grid';
import { isSquareLikeScreen, lp } from '../../utils';

export const getForegroundGridConfig = () => {
    return lp(getForegroundGridLandscapeConfig, getForegroundGridPortraitConfig).call(null);
};

const getForegroundGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    const bottomBarBounds = isSquareLikeScreen()
        ? { x: 0, y: 0.7, width: 1, height: 0.225 }
        : { x: 0, y: 0.725, width: 1, height: 0.275 };
    return {
        name: 'foreground',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'bottomBar',
                bounds: bottomBarBounds,
            },
            {
                name: 'text_from',
                bounds: { x: -1, y: 0, width: 0.8, height: 1 },
            },
            {
                name: 'text_show',
                bounds: { x: 0.1, y: 0, width: 0.8, height: 1 },
            },
            {
                name: 'text_to',
                bounds: { x: 1, y: 0, width: 0.8, height: 1 },
            },
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.9, width: 0.1, height: 0.1 },
                offset: { x: 10, y: -10 },
            },
        ],
    };
};

const getForegroundGridPortraitConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'foreground',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'bottomBar',
                bounds: { x: 0.05, y: 0.74, width: 0.9, height: 0.25 },
            },
            {
                name: 'text_from',
                bounds: { x: -1, y: 0, width: 0.8, height: 1 },
            },
            {
                name: 'text_show',
                bounds: { x: 0.025, y: 0, width: 0.95, height: 1 },
            },
            {
                name: 'text_to',
                bounds: { x: 1, y: 0, width: 0.8, height: 1 },
            },
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.925, width: 0.075, height: 0.075 },
                offset: { x: 10, y: -10 },
            },
        ],
    };
};
