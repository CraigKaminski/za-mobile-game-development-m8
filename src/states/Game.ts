import Plant, { IPlantData } from '../prefabs/Plant';
import Zombie, { IZombieData } from '../prefabs/Zombie';

export default class Game extends Phaser.State {
  public bullets: Phaser.Group;
  public suns: Phaser.Group;
  private background: Phaser.Sprite;
  private currentLevel: string;
  private plants: Phaser.Group;
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

    const zombieData: IZombieData = {
      animationFrames: [0, 1, 2, 1],
      asset: 'zombie',
      attack: 0.1,
      health: 10,
      velocity: -20,
    };

    const zombie = new Zombie(this, 300, 100, zombieData);
    this.zombies.add(zombie);

    const plantData: IPlantData = {
      health: 10,
      plantAsset: 'plant',
    };

    const plant = new Plant(this, 100, 100, plantData);
    this.plants.add(plant);
  }

  public update() {

  }

  private gameOver() {
    this.state.start('Game');
  }
}
