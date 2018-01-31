export default class Plant extends Phaser.Sprite {
  constructor(game: Phaser.Game, x: number, y: number, data: any) {
    super(game, x, y, data.plantAsset);
  }
}
