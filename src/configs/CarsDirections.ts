export const DIRECTION = {
    northWest: 'north-west',
    northEast: 'north-east',
    southEast: 'south-east',
    southWest: 'south-west',
};

export const getDirection = (start, end): string => {
    if (!end) return DIRECTION.northWest;
    if (start.x < end.x && start.y < end.y) return DIRECTION.northWest;
    if (start.x > end.x && start.y < end.y) return DIRECTION.northEast;
    if (start.x < end.x && start.y > end.y) return DIRECTION.southWest;
    if (start.x > end.x && start.y > end.y) return DIRECTION.southEast;
    return DIRECTION.northWest;
};
