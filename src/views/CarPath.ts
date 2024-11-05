import anime from 'animejs';
import { Container } from 'pixi.js';
import { getDirection } from '../configs/CarsDirections';
import { callIfExists, dist } from '../utils';
import { Car } from './Car';

export type PointLike = { x: number; y: number };

export class CarPath extends Container {
    constructor(private points: PointLike[]) {
        super();

        // this.points.forEach((p) => {
        //     drawPoint(this, p.x, p.y, 10, 0xff0000);
        // });
    }

    public move(cb?): void {
        const car = this.getCar();
        let i = 1;

        const move = (i) => {
            const duration = this.getCarSpeed(i);

            anime({
                targets: car,
                x: this.points[i].x,
                y: this.points[i].y,
                duration,
                easing: 'linear',
                complete: () => {
                    i++;
                    if (i < this.points.length) {
                        car.updateTexture(getDirection(this.points[i - 1], this.points[i]));
                        move(i);
                    } else if (i === this.points.length) {
                        car.destroy();
                        callIfExists(cb);
                    }
                },
            });
        };

        move(i);
    }

    private getCar(): Car {
        const carType = this.getRandomCarConfig();
        const dir = getDirection(this.points[0], this.points[1]);
        const car = new Car(carType, dir);
        car.position.set(this.points[0].x, this.points[0].y);
        this.addChild(car);

        return car;
    }

    private getRandomCarConfig(): string {
        const rnd = Math.floor(Math.random() * 7);
        return rnd === 0 ? 'bus' : `car-${rnd}`;
    }

    private getCarSpeed(i: number): number {
        const distance = dist(this.points[i - 1], this.points[i]);
        return distance * 5;
    }
}
