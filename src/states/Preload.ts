export default class Preload extends Phaser.State {
  private preloadBar: Phaser.Sprite;

  public preload() {
    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('background', 'images/background.png');
    this.load.image('chilliButton', 'images/button_chilli.png');
    this.load.image('sunflowerButton', 'images/button_sunflower.png');
    this.load.image('plantButton', 'images/button_plant.png');
    this.load.image('bloodParticle', 'images/blood.png');
    this.load.image('bullet', 'images/bullet.png');
    this.load.image('chilli', 'images/chilli.png');
    this.load.image('sunflower', 'images/sunflower.png');
    this.load.image('deadZombie', 'images/dead_zombie.png');
    this.load.spritesheet('chicken', 'images/chicken_sheet.png', 25, 25, 3, 1, 2);
    this.load.spritesheet('zombie', 'images/zombie_sheet.png', 30, 50, 3, 1, 2);
    this.load.spritesheet('plant', 'images/plant_sheet.png', 24, 40, 3, 1, 2);
    this.load.spritesheet('sun', 'images/sun_sheet.png', 30, 30, 2, 1, 2);

    this.load.audio('hit', ['audio/hit.mp3', 'audio/hit.ogg']);

    this.load.text('buttonData', 'data/buttons.json');
    this.load.text('level1', 'data/level1.json');
    this.load.text('level2', 'data/level2.json');
  }

  public create() {
    this.state.start('Game');
  }
}
