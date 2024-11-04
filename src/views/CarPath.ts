import anime from 'animejs';
import { Container, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { getDirection } from '../configs/CarsDirections';
import { dist, drawPoint, makeSprite } from '../utils';

export type PointLike = { x: number; y: number };

export class CarPath extends Container {
    private car: Sprite;
    private _hasMovingCar = false;
    private currentTexture = 'bus';

    constructor(private points: PointLike[]) {
        super();

        this.points.forEach((p, i) => {
            drawPoint(this, p.x, p.y, 10, 0xff0000);
        });

        this.build();
    }

    get hasMovingCar(): boolean {
        return this._hasMovingCar;
    }

    public move(): void {
        if (this.hasMovingCar) return;
        console.warn('move');

        this.points = Math.random() > 0.5 ? this.points : this.points.reverse();
        this._hasMovingCar = true;
        this.car.visible = true;
        this.updateCarTexture();
        let i = 1;
        this.car.position.set(this.points[0].x, this.points[0].y);

        const move = (i) => {
            const duration = this.getCarSpeed(i);

            anime({
                targets: this.car,
                x: this.points[i].x,
                y: this.points[i].y,
                duration,
                easing: 'linear',
                complete: () => {
                    i++;
                    if (i < this.points.length) {
                        this.car.texture = Texture.from(
                            Images[`cars-${getDirection(this.points[i - 1], this.points[i])}/${this.currentTexture}`],
                        );
                        move(i);
                    } else if (i === this.points.length) {
                        this._hasMovingCar = false;
                        this.car.visible = false;
                    }
                },
            });
        };

        move(i);
    }

    private build() {
        this.buildCar();
    }

    private buildCar() {
        this.car = makeSprite({ texture: Images['cars-north-east/bus'] });
        // this.car.texture = PIXI.Texture.from('car');
        this.car.anchor.set(0.5);
        this.car.scale.set(0.4);
        this.car.position.set(this.points[0].x, this.points[0].y);
        this.car.visible = false;
        this.addChild(this.car);
    }

    private updateCarTexture(): void {
        const { scale, car } = this.getRandomCarConfig();
        this.currentTexture = car;
        const dir = getDirection(this.points[0], this.points[1]);
        this.car.texture = Texture.from(Images[`cars-${dir}/${car}`]);
        this.car.scale.set(scale);
    }

    private getRandomCarConfig(): { car: string; scale: number } {
        const rnd = Math.floor(Math.random() * 7);
        if (rnd === 0) {
            return {
                car: 'bus',
                scale: 0.4,
            };
        } else {
            return { car: `car-${rnd}`, scale: 0.5 };
        }
    }

    private getCarSpeed(i: number): number {
        const distance = dist(this.points[i - 1], this.points[i]);
        return distance * (this.currentTexture === 'bus' ? 4 : Math.random() + 3);
    }
}
