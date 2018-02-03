import Game from '../states/Game';
import Bullet from './Bullet';

export interface IPlantData {
  animationFrames: number[];
  health: number;
  isShooter: boolean;
  plantAsset: string;
}

export default class Plant extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private animationName: string;
  private bullets: Phaser.Group;
  private isShooter: boolean;
  private producingTimer: Phaser.Timer;
  private shootingTimer: Phaser.Timer;
  private state: Game;
  private suns: Phaser.Group;

  constructor(state: Game, x: number, y: number, data: IPlantData) {
    super(state.game, x, y, data.plantAsset);

    this.bullets = state.bullets;
    this.state = state;
    this.suns = state.suns;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;

    this.producingTimer = this.game.time.create(false);
    this.shootingTimer = this.game.time.create(false);

    this.resetData(x, y, data);
  }

  public kill() {
    super.kill();

    this.producingTimer.stop();
    this.shootingTimer.stop();

    return this;
  }

  public resetData(x: number, y: number, data: IPlantData) {
    super.reset(x, y, data.health);

    this.loadTexture(data.plantAsset);

    if (data.animationFrames) {
      this.animationName = data.plantAsset + 'Anim';
      this.animations.add(this.animationName, data.animationFrames, 6, false);
    }

    this.isShooter = data.isShooter;

    if (this.isShooter) {
      this.shootingTimer.start();
      this.scheduleShooting();
    }

    return this;
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
