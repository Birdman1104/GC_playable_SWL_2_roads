export const AdModelEvents = {
    StatusUpdate: 'AdModelStatusUpdate',
    CtaUpdate: 'AdModelCtaUpdate',
    SoundUpdate: 'AdModelSoundUpdate',
    HintUpdate: 'AdModelHintUpdate',
};

export const AreaModelEvents = { BuildingUpdate: 'AreaModelBuildingUpdate' };

export const BoardModelEvents = {
    StateUpdate: 'BoardModelStateUpdate',
    CoinsUpdate: 'BoardModelCoinsUpdate',
    HealthUpdate: 'BoardModelHealthUpdate',
    FoodUpdate: 'BoardModelFoodUpdate',
    JoyUpdate: 'BoardModelJoyUpdate',
    AreasUpdate: 'BoardModelAreasUpdate',
    ButtonsUpdate: 'BoardModelButtonsUpdate',
};

export const ButtonModelEvents = { TypeUpdate: 'ButtonModelTypeUpdate', IsActiveUpdate: 'ButtonModelIsActiveUpdate' };

export const CtaModelEvents = { VisibleUpdate: 'CtaModelVisibleUpdate' };

export const GameModelEvents = {
    StateUpdate: 'GameModelStateUpdate',
    IsTutorialUpdate: 'GameModelIsTutorialUpdate',
    BoardUpdate: 'GameModelBoardUpdate',
};

export const HeadModelEvents = { GameModelUpdate: 'HeadModelGameModelUpdate', AdUpdate: 'HeadModelAdUpdate' };

export const HintModelEvents = { StateUpdate: 'HintModelStateUpdate', VisibleUpdate: 'HintModelVisibleUpdate' };

export const SoundModelEvents = { StateUpdate: 'SoundModelStateUpdate' };
