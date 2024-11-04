import anime from 'animejs';
import { AnimatedSprite, Container, Point, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { AreaModel, BuildingType } from '../models/AreaModel';
import { makeSprite } from '../utils';

export class Area extends Container {
    private area: Sprite;
    private building: Sprite;
    private _buildingType = BuildingType.None;
    private particles: Sprite[] = [];
    private particlesContainer: Container;

    constructor(private config: AreaModel) {
        super();
        this._buildingType = config.building;
        this.build();
    }

    get uuid() {
        return this.config.uuid;
    }

    get type() {
        return this.config.type;
    }

    get buildingType() {
        return this._buildingType;
    }

    public playCoinsAnimation(): void {
        if (!this.building) return;

        anime.remove(this.building.scale);
        this.building.scale.set(1);

        this.playParticleAnimation();

        anime({
            targets: this.building.scale,
            x: [1, 1.2, 0.8],
            y: [1, 0.8, 1.2],
            alpha: [1, 1, 0.2],
            duration: 500,
            easing: 'easeInOutSine',
            direction: 'alternate',
        });
    }

    public playParticleAnimation(): void {
        if (!this.building) return;
        this.removeParticles();

        const rnd = Math.ceil(Math.random() * 3 + 7);
        const texture = getParticleImage(this._buildingType);
        const PARTICLE_Y = -this.building.height / 2;
        const PARTICLE_X = 0;
        const DURATION = 500;
        const DELAY = 20;

        for (let i = 0; i < rnd; i++) {
            const DIFF_Y = Math.random() * 0.5 + 0.5;
            const TARGET_X = Math.random() * this.building.width - this.building.width / 2;
            const TOP_Y = Math.random() * 50 - Math.min(Math.max(this.building.height * 1.5, 130), 220);
            const ANGLE = Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1);

            const particle = makeSprite({ texture, anchor: new Point(0.5, 0.5) });
            particle.position.set(PARTICLE_X, PARTICLE_Y);
            particle.scale.set(Math.random() * 0.5 + 0.3);
            this.particles.push(particle);
            this.particlesContainer.addChild(particle);

            anime({
                targets: particle,
                x: TARGET_X,
                y: [PARTICLE_Y, TOP_Y, TOP_Y * DIFF_Y],
                alpha: [1, 1, 0.7, 0],
                angle: ANGLE,
                duration: DURATION,
                delay: i * DELAY,
                easing: 'easeInOutSine',
                complete: () => {
                    i === rnd - 1 && this.removeParticles();
                },
            });
        }
    }

    public addBuilding(buildingType: BuildingType): void {
        this.buildParticlesContainer();

        this._buildingType = buildingType;
        this.building = makeSprite(getBuildingImgConfig(buildingType));
        if (this.buildingType === BuildingType.Hospital) {
            this.building.position.set(10, -10);
        }
        this.building.scale.set(0);
        this.particlesContainer.position.set(0, 40);
        anime({
            targets: this.area.scale,
            x: 0,
            y: 0,
            duration: 200,
            easing: 'easeInOutSine',
            complete: () => {
                anime({
                    targets: this.building.scale,
                    x: 1,
                    y: 1,
                    duration: 200,
                    easing: 'easeInOutSine',
                    complete: () => {
                        if (buildingType === BuildingType.House) {
                            this.emit('animationComplete');
                        } else {
                            this.playParticleAnimation();
                        }
                    },
                });
            },
        });

        this.addDustAnimation();

        this.addChild(this.building);
    }

    private addDustAnimation(): void {
        const frames: any[] = [];
        for (let i = 1; i <= 9; i++) {
            frames.push(Images[`game/${i}`]);
        }

        const anim = AnimatedSprite.fromFrames(frames);
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.5;
        anim.scale.set(0.6);
        anim.loop = false;

        anim.play();
        anim.onComplete = () => {
            anim.destroy();
        };
        this.addChild(anim);
    }

    private build() {
        if (this.buildingType) {
            this.buildParticlesContainer();
            this.buildBuilding();
            if (this.buildingType === BuildingType.FortuneWheel) {
                this.buildGlow();
            }
        } else {
            this.buildArea();
        }
    }

    private buildArea() {
        this.area = makeSprite({ texture: Images[`game/${this.type}`], anchor: new Point(0.5, 0.5) });
        this.addChild(this.area);
    }

    private buildBuilding() {
        this.building = makeSprite(getBuildingImgConfig(this.config.building));
        this.particlesContainer.position.set(0, -this.building.height / 2);
        this.addChild(this.building);
    }

    private buildGlow(): void {
        const glow = makeSprite({ texture: Images['game/fortune_wheel_glow'], anchor: new Point(0.5, 0.8) });
        this.addChild(glow);

        anime({
            targets: glow,
            alpha: 0,
            duration: 700,
            loop: true,
            easing: 'linear',
            direction: 'alternate',
        });
    }

    private buildParticlesContainer() {
        this.particlesContainer = new Container();

        this.addChild(this.particlesContainer);
    }

    private removeParticles(): void {
        if (this.particles.length === 0) return;
        this.particles.forEach((particle, i) => {
            if (!particle) return;
            anime.remove(particle);
            particle.destroy();
            this.particlesContainer.removeChild(particle);
        });
        this.particles = [];
    }
}

const getParticleImage = (building: BuildingType): string => {
    switch (building) {
        case BuildingType.Hospital:
            return Images['game/health_small'];
        case BuildingType.Food:
            return Images['game/burger_small'];
        case BuildingType.WinterFountain:
            return Images['game/emoji_small'];
        case BuildingType.House:
            return Images['game/coin_small'];
        default:
            return '';
    }
};

const getBuildingImgConfig = (building: BuildingType): { texture: string; anchor: Point } => {
    let texture = Images['game/house'];
    let anchor = new Point(0.5, 0.7);
    switch (building) {
        case BuildingType.Hospital:
            texture = Images['game/hospital'];
            anchor = new Point(0.5, 0.7);
            break;
        case BuildingType.Food:
            texture = Images['game/cafe'];
            anchor = new Point(0.55, 0.6);
            break;
        case BuildingType.Park:
            texture = Images['game/alley_fountain'];
            anchor = new Point(0.5, 0.6);
            break;
        case BuildingType.FortuneWheel:
            texture = Images['game/fortune_wheel'];
            anchor = new Point(0.5, 0.8);
            break;
        case BuildingType.WinterFountain:
            texture = Images['game/winter_fountain'];
            anchor = new Point(0.5, 0.55);
            break;
        case BuildingType.House:
            texture = Images['game/house'];
            anchor = new Point(0.5, 0.7);
            break;
        default:
            break;
    }

    return { texture, anchor };
};
