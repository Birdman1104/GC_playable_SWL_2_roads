import { isSquareLikeScreen, lp } from '../../utils';

export const getUIGridConfig = () => {
    return lp(getUIGridLandscapeConfig, getUIGridPortraitConfig).call(null);
};

const getUIGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    const bottomBarBounds = isSquareLikeScreen()
        ? { x: 0, y: 0.7, width: 1, height: 0.225 }
        : { x: 0, y: 0.725, width: 1, height: 0.275 };
    return {
        name: 'ui',
        // debug: { color: 0xd950ff },
        bounds,
        cells: [
            {
                name: 'bottomBar',
                bounds: bottomBarBounds,
            },
            {
                name: 'topBar',
                bounds: { x: 0.1, y: 0.01, width: 0.8, height: 0.15 },
            },
        ],
    };
};

const getUIGridPortraitConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'ui',
        // debug: { color: 0xd950ff },
        bounds,
        cells: [
            {
                name: 'bottomBar',
                bounds: { x: 0.05, y: 0.74, width: 0.9, height: 0.25 },
            },
            {
                name: 'topBar',
                bounds: { x: 0.025, y: 0.01, width: 0.95, height: 0.2 },
            },
        ],
    };
};
