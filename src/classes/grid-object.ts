import Phaser from "phaser";

export default abstract class GridObject {
  readonly name: string;
  row: number;
  col: number;

  // grid: Grid;

  readonly scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, name: string, spriteName: string) {
    this.name = name;
    this.row = 0;
    this.col = 0;
    this.scene = scene;
    this.sprite = this.scene.add.sprite(0, 0, spriteName);
  }

  /**
   * Called by grid for this object to take its turn.
   */
  abstract takeTurn(): void;

  moveToCell(row: number, col: number) {
    this.row = row;
    this.col = col;
    //this.sprite.x = this.col * Grid.cellWidth;
    //this.sprite.y = this.row * Grid.cellHeight;
  }
}
