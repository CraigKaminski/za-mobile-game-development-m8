import Game from '../states/Game';
import Bullet from './Bullet';

export interface IPlantData {
  animationFrames: number[];
  health: number;
  isShooter: boolean;
  isSunProducer: boolean;
  plantAsset: string;
}

export default class Plant extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private animationName: string;
  private bullets: Phaser.Group;
  private isShooter: boolean;
  private isSunProducer: boolean;
  private patch: Phaser.Sprite;
  private producingTimer: Phaser.Timer;
  private shootingTimer: Phaser.Timer;
  private state: Game;
  private suns: Phaser.Group;

  constructor(state: Game, x: number, y: number, data: IPlantData, patch: Phaser.Sprite) {
    super(state.game, x, y, data.plantAsset);

    this.bullets = state.bullets;
    this.state = state;
    this.suns = state.suns;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;

    this.producingTimer = this.game.time.create(false);
    this.shootingTimer = this.game.time.create(false);

    this.resetData(x, y, data, patch);
  }

  public kill() {
    super.kill();

    this.producingTimer.stop();
    this.shootingTimer.stop();
    this.patch.data.isBusy = false;

    return this;
  }

  public resetData(x: number, y: number, data: IPlantData, patch: Phaser.Sprite) {
    super.reset(x, y, data.health);

    this.loadTexture(data.plantAsset);

    if (data.animationFrames) {
      this.animationName = data.plantAsset + 'Anim';
      this.animations.add(this.animationName, data.animationFrames, 6, false);
    }

    this.isShooter = data.isShooter;
    this.isSunProducer = data.isSunProducer;
    this.patch = patch;

    if (this.isShooter) {
      this.shootingTimer.start();
      this.scheduleShooting();
    }

    if (this.isSunProducer) {
      this.producingTimer.start();
      this.scheduleProduction();
    }

    return this;
  }

  private produceSun() {
    const diffX = -40 + Math.random() * 80;
    const diffY = -40 + Math.random() * 80;

    this.state.createSun(this.x + diffX, this.y + diffY);
  }

  private scheduleProduction() {
    this.produceSun();

    this.producingTimer.add(Phaser.Timer.SECOND * 5, this.scheduleProduction, this);
  }

  private scheduleShooting() {
    this.shoot();

    this.shootingTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this);
  }

  private shoot() {
    let newElement: Bullet = this.bullets.getFirstDead();
    const y = this.y - 10;

    if (this.animations.getAnimation(this.animationName)) {
      this.play(this.animationName);
    }

    if (!newElement) {
      newElement = new Bullet(this.state, this.x, y);
      this.bullets.add(newElement);
    } else {
      newElement.reset(this.x, y);
    }

    newElement.body.velocity.x = 100;
  }
}
