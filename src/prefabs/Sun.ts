import Game from '../states/Game';

export default class Sun extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private state: Game;
  private sunExpirationTimer: Phaser.Timer;

  constructor(state: Game, x: number, y: number) {
    super(state.game, x, y, 'sun');

    this.state = state;

    this.game.physics.arcade.enable(this);

    this.animations.add('shine', [0, 1], 10, true);
    this.play('shine');

    this.anchor.setTo(0.5);

    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(() => {
      this.state.increaseSun(25);

      this.kill();
    });

    this.sunExpirationTimer = this.game.time.create(false);
    this.reset(x, y);
  }

  public kill() {
    super.kill();

    this.sunExpirationTimer.stop();

    return this;
  }

  public reset(x: number, y: number, health?: number | undefined) {
    super.reset(x, y);

    this.scheduleExpiration();

    return this;
  }

  private scheduleExpiration() {
    const expirationTime = 2 + Math.random() * 4;

    this.sunExpirationTimer.start();

    this.sunExpirationTimer.add(Phaser.Timer.SECOND + expirationTime, () => {
      this.kill();
    });
  }
}
