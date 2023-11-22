import Phaser from "phaser";
import { Position } from "./grid";
import Grid from "./grid";

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

  get pos(): Position {
    return {row: this._row, col: this._col};
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
    const ratio = this.sprite.height / this.sprite.width;
    this.sprite.width = Grid.tileWidth;
    this.sprite.height = ratio * Grid.tileWidth;
    this.addToGrid();
  }

  private addToGrid() {
    Grid.addTileObj(this);
  }

  private removeFromGrid() {
    Grid.removeTileObj(this);
  }

  /**
   * get the neighboring TileObjects to this TileObject
   * @returns arrays of neighbors to the left, right, up, and down directions
   */
  getNeighbors(): {
    left: TileObject[];
    right: TileObject[];
    up: TileObject[];
    down: TileObject[];
  } {
    return Grid.getAdjacentTiles(this);
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
    this.removeFromGrid();
    this._row = row;
    this._col = col;
    this.sprite.x = this.col * Grid.tileWidth;
    this.sprite.y = this.row * Grid.tileHeight;
    this.addToGrid();
  }

  /**
   * move the object to a specific grid column, keeping its row position
   * @param col grid column number
   */
  moveToCol(col: number) {
    this.moveToTile(this._row, col);
  }

  /**
   * move the object to a specific grid row, keeping its column position
   * @param row grid row number
   */
  moveToRow(row: number) {
    this.moveToTile(row, this._col);
  }
}
