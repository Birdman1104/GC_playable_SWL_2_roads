import { PointLike } from '../views/CarPath';

export type Path = PointLike[];

export const RELEASE_ORDER = [
    {
        pathIndex: 0,
        delay: 0,
    },
    {
        pathIndex: 0,
        delay: 2,
    },
    {
        pathIndex: 2,
        delay: 2,
    },
    {
        pathIndex: 2,
        delay: 3,
    },
    {
        pathIndex: 3,
        delay: 4,
    },
    {
        pathIndex: 1,
        delay: 10,
    },
    {
        pathIndex: 0,
        delay: 12,
    },
    {
        pathIndex: 3,
        delay: 14,
    },
];

export const PATHS = Object.freeze([
    [
        {
            x: -920,
            y: -467,
        },
        {
            x: 930,
            y: 470,
        },
    ],
    [
        {
            x: 930,
            y: 470,
        },
        {
            x: 55,
            y: 30,
        },
        {
            x: 170,
            y: -40,
        },
        {
            x: 315,
            y: 40,
        },
        {
            x: 940,
            y: -280,
        },
    ],
    [
        {
            x: 950,
            y: -280,
        },
        {
            x: 315,
            y: 35,
        },
        {
            x: -115,
            y: -165,
        },
        {
            x: -436,
            y: 0,
        },
        {
            x: -570,
            y: -60,
        },
        {
            x: -945,
            y: 130,
        },
    ],
    [
        {
            x: -945,
            y: 130,
        },
        {
            x: -445,
            y: -105,
        },
        {
            x: -60,
            y: 80,
        },
        {
            x: 165,
            y: -30,
        },
        {
            x: 315,
            y: 35,
        },
        {
            x: 940,
            y: -280,
        },
    ],
]);
