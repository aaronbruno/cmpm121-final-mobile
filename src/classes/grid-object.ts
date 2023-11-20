import Phaser from "phaser";

export default abstract class GridObject {
  readonly name: string;
  row: number;
  col: number;

  // grid: Grid;

  readonly scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;

  /**
   * get a new grid object
   * @param scene the scene this object is being placed in
   * @param name the name of the object
   * @param spriteName the sprite name that will be used to create its Phaser sprite
   */
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

  /**
   * move this object to a specific grid position
   * @param row grid row number
   * @param col grid column number
   */
  moveToCell(row: number, col: number) {
    this.row = row;
    this.col = col;
    //this.sprite.x = this.col * Grid.cellWidth;
    //this.sprite.y = this.row * Grid.cellHeight;
  }
}
