import { CellScale } from '@armathai/pixi-grid';
import { lp } from '../../utils';

export const getForegroundGridConfig = () => {
    return lp(getForegroundGridLandscapeConfig, getForegroundGridPortraitConfig).call(null);
};

const getForegroundGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'foreground',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'cell',
                bounds: { x: 0, y: 0, width: 1, height: 1 },
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
                name: 'cell',
                bounds: { x: 0, y: 0, width: 1, height: 1 },
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
        ],
    };
};
