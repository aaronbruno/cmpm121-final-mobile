import Phaser from "phaser";

export default abstract class TileObject {
  readonly name: string;
  private _row: number;
  get row(): number { 
    return this._row; 
  }

  private _col: number;
  get col(): number { 
    return this._col; 
  }

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
    this._row = 0;
    this._col = 0;
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
  moveToTile(row: number, col: number) {
    this._row = row;
    this._col = col;
    //this.sprite.x = this.col * Grid.tileWidth;
    //this.sprite.y = this.row * Grid.tileHeight;
  }

  /**
   * move the object to a specific grid column, keeping its row position
   * @param col grid column number
   */
  moveToCol(col: number) {
    this._col = col;
    //this.sprite.x = this.col * Grid.tileWidth;
  }

  /**
   * move the object to a specific grid row, keeping its column position
   * @param row grid row number
   */
  moveToRow(row: number) {
    this._row = row;
    //this.sprite.y = this.row * Grid.tileWidth;
  }
}
