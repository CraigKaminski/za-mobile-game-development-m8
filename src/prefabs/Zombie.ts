import Game from '../states/Game';

export interface IZombieData {
  animationFrames: number[];
  asset: string;
  attack: number;
  health: number;
  velocity: number;
}

export default class Zombie extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private animationName: string;
  private attack: number;
  private defaultVelocity: number;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IZombieData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.anchor.setTo(0.5);

    this.game.physics.arcade.enable(this);

    this.resetData(x, y, data);
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
