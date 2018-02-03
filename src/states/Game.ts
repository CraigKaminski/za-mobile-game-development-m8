import Plant, { IPlantData } from '../prefabs/Plant';
import Zombie, { IZombieData } from '../prefabs/Zombie';

export default class Game extends Phaser.State {
  public bullets: Phaser.Group;
  public suns: Phaser.Group;
  private background: Phaser.Sprite;
  private currentLevel: string;
  private numSuns = 100;
  private plants: Phaser.Group;
  private sunLabel: Phaser.Text;
  private zombies: Phaser.Group;
  private readonly HOUSE_X = 60;

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

    this.createGui();

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
      animationFrames: [1, 2, 1, 0],
      health: 10,
      isShooter: true,
      plantAsset: 'plant',
    };

    const plant = new Plant(this, 100, 100, plantData);
    this.plants.add(plant);
  }

  public increaseSun(amount: number) {
    this.numSuns += amount;
    this.updateStats();
  }

  public update() {
    this.physics.arcade.collide(this.plants, this.zombies, this.attackPlant, undefined, this);

    this.zombies.forEachAlive((zombie: Zombie) => {
      zombie.body.velocity.x = zombie.defaultVelocity;

      if (zombie.x <= this.HOUSE_X) {
        this.gameOver();
      }
    }, this);
  }

  private attackPlant(plant: Plant, zombie: Zombie) {
    plant.damage(zombie.attack);
  }

  private createGui() {
    const sun = this.add.sprite(10, this.game.height - 20, 'sun');
    sun.anchor.setTo(0.5);
    sun.scale.setTo(0.5);

    const style = {
      fill: '#fff',
      font: '14px Arial',
    };
    this.sunLabel = this.add.text(22, this.game.height - 28, '', style);

    this.updateStats();
  }

  private createPlant(x: number, y: number, data: IPlantData) {
    let newElement: Plant = this.plants.getFirstDead();

    if (!newElement) {
      newElement = new Plant(this, x, y, data);
      this.plants.add(newElement);
    } else {
      newElement.resetData(x, y, data);
    }

    return newElement;
  }

  private createZombie(x: number, y: number, data: IZombieData) {
    let newElement: Zombie = this.zombies.getFirstDead();

    if (!newElement) {
      newElement = new Zombie(this, x, y, data);
      this.zombies.add(newElement);
    } else {
      newElement.resetData(x, y, data);
    }

    return newElement;
  }

  private gameOver() {
    this.state.start('Game');
  }

  private updateStats() {
    this.sunLabel.text = this.numSuns.toString();
  }
}
