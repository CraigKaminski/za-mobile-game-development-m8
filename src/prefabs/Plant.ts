import Game from '../states/Game';

export interface IPlantData {
  health: number;
  plantAsset: string;
}

export default class Plant extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private bullets: Phaser.Group;
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

    this.resetData(x, y, data);
  }

  public resetData(x: number, y: number, data: IPlantData) {
    super.reset(x, y, data.health);

    this.loadTexture(data.plantAsset);

    return this;
  }
}
