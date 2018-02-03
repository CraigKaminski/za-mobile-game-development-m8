import Game from '../states/Game';

export interface IZombieData {
  animationFrames: number[];
  asset: string;
  attack: number;
  health: number;
  velocity: number;
}

export default class Zombie extends Phaser.Sprite {
  public attack: number;
  public body: Phaser.Physics.Arcade.Body;
  public defaultVelocity: number;
  private animationName: string;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IZombieData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.anchor.setTo(0.5);

    this.game.physics.arcade.enable(this);

    this.resetData(x, y, data);
  }

  public damage(amount: number) {
    super.damage(amount);

    const emitter = this.game.add.emitter(this.x, this.y, 50);
    emitter.makeParticles('bloodParticle');
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity.y = 300;
    emitter.start(true, 200, undefined, 100);

    if (this.health <= 0) {
      const corpse = this.game.add.sprite(this.x, this.bottom, 'deadZombie');
      corpse.anchor.setTo(0.5, 1);
    }

    return this;
  }

  public resetData(x: number, y: number, data: IZombieData) {
    super.reset(x, y, data.health);

    this.loadTexture(data.asset);

    if (data.animationFrames) {
      this.animationName = data.asset + 'Anim';
      this.animations.add(this.animationName, data.animationFrames, 4, true);
      this.play(this.animationName);
    }

    this.attack = data.attack;
    this.defaultVelocity = data.velocity;
    this.body.velocity.x = data.velocity;

    return this;
  }
}
