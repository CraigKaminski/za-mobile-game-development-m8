import Bullet from '../prefabs/Bullet';
import Plant, { IPlantData } from '../prefabs/Plant';
import Sun from '../prefabs/Sun';
import Zombie, { IZombieData } from '../prefabs/Zombie';

export default class Game extends Phaser.State {
  public bullets: Phaser.Group;
  public suns: Phaser.Group;
  private background: Phaser.Sprite;
  private buttonData: any;
  private buttons: Phaser.Group;
  private currentLevel: string;
  private currentSelection: any;
  private hitSound: Phaser.Sound;
  private numSuns = 100;
  private plantLabel: Phaser.Text;
  private plants: Phaser.Group;
  private sunGenerationTimer: Phaser.Timer;
  private sunLabel: Phaser.Text;
  private zombies: Phaser.Group;
  private readonly HOUSE_X = 60;
  private readonly SUN_FREQUENCY = 5;
  private readonly SUN_VELOCITY = 50;

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
      isSunProducer: false,
      plantAsset: 'plant',
    };

    const plant = new Plant(this, 100, 100, plantData);
    this.plants.add(plant);

    this.sunGenerationTimer = this.game.time.create(false);
    this.sunGenerationTimer.start();
    this.scheduleSunGeneration();

    this.hitSound = this.add.audio('hit');
  }

  public createSun(x: number, y: number) {
    let newElement: Sun = this.suns.getFirstDead();

    if (!newElement) {
      newElement = new Sun(this, x, y);
      this.suns.add(newElement);
    } else {
      newElement.reset(x, y);
    }

    return newElement;
  }

  public increaseSun(amount: number) {
    this.numSuns += amount;
    this.updateStats();
  }

  public update() {
    this.physics.arcade.collide(this.plants, this.zombies, this.attackPlant, undefined, this);
    this.physics.arcade.collide(this.bullets, this.zombies, this.hitZombi, undefined, this);

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

  private clearSelection() {
    this.plantLabel.text = '';
    this.currentSelection = null;

    this.buttons.forEach((button: Phaser.Button) => {
      button.alpha = 1;
      button.data.selected = false;
    }, this);
  }

  private clickButton(button: Phaser.Button) {
    if (!button.data.selected) {
      this.clearSelection();
      this.plantLabel.text = 'Cost: ' + button.data.cost;

      if (this.numSuns >= button.data.cost) {
        button.data.selected = true;
        button.alpha = 0.5;

        this.currentSelection = button.data;
      } else {
        this.plantLabel.text += ' - Too expensive!';
      }
    } else {
      this.clearSelection();
    }
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

    this.buttonData = JSON.parse(this.cache.getText('buttonData'));

    this.buttons = this.add.group();

    let button: Phaser.Button;
    this.buttonData.forEach((element: any, index: number) => {
      button = new Phaser.Button(this.game, 80 + index * 40, this.game.height - 35,
        element.btnAsset, this.clickButton, this);
      this.buttons.add(button);
      button.data = element;
    });

    this.plantLabel = this.add.text(300, this.game.height - 28, '', style);
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

  private generateRandomSun() {
    const y = -20;
    const x = 40 + 420 * Math.random();

    const sun = this.createSun(x, y);
    sun.body.velocity.y = this.SUN_VELOCITY;
  }

  private hitZombi(bullet: Bullet, zombie: Zombie) {
    bullet.kill();
    this.hitSound.play();
    zombie.damage(1);
  }

  private scheduleSunGeneration() {
    this.sunGenerationTimer.add(Phaser.Timer.SECOND * this.SUN_FREQUENCY, () => {
      this.generateRandomSun();
      this.scheduleSunGeneration();
    });
  }

  private updateStats() {
    this.sunLabel.text = this.numSuns.toString();
  }
}
