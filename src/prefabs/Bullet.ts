import Game from '../states/Game';

export default class Bullet extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private state: Game;

  constructor(state: Game, x: number, y: number) {
    super(state.game, x, y, 'bullet');

    this.state = state;

    this.game.physics.arcade.enable(this);
    this.body.velocity.x = 100;
  }

  public update() {
    if (this.x >= this.game.width) {
      this.kill();
    }
  }
}
