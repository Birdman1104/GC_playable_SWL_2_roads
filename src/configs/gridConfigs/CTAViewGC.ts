import { CellScale } from '@armathai/pixi-grid';
import { lp } from '../../utils';

export const getCTAGridConfig = () => {
    return lp(getCTAGridLandscapeConfig, getCTAGridPortraitConfig).call(null);
};

const getCTAGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'mainCell',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'fail_icon',
                bounds: { x: 0.2, y: 0.1, width: 0.6, height: 0.5 },
            },
            {
                name: 'button',
                bounds: { x: 0.2, y: 0.7, width: 0.6, height: 0.2 },
            },
            
        ],
    };
};

const getCTAGridPortraitConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'mainCell',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'fail_icon',
                bounds: { x: 0.2, y: 0.1, width: 0.6, height: 0.5 },
            },
            {
                name: 'button',
                bounds: { x: 0.2, y: 0.7, width: 0.6, height: 0.2 },
            },
        ],
    };
};
