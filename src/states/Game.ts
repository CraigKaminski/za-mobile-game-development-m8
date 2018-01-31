export default class Game extends Phaser.State {
  private background: Phaser.Sprite;
  private bullets: Phaser.Group;
  private currentLevel: string;
  private plants: Phaser.Group;
  private suns: Phaser.Group;
  private zombies: Phaser.Group;

  public init(currentLevel: string) {
    this.currentLevel = currentLevel ? currentLevel : 'level1';

    this.physics.arcade.gravity.y = 0;
  }

  public create() {
    this.background = this.add.sprite(0, 0, 'background');

    this.bullets = this.add.group();
    this.plants = this.add.group();
    this.suns = this.add.group();
    this.zombies = this.add.group();
  }

  public update() {

  }

  private gameOver() {
    this.state.start('Game');
  }
}
