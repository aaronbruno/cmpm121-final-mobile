import Phaser from "phaser";
import { Position } from "./grid";
import Grid from "./grid";

export interface TileObjectConfig {
  readonly scene: Phaser.Scene;
  readonly name: string;
  readonly spriteName: string;
  readonly row: number;
  readonly col: number;
}

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

  /**
   * returns the key used to access this object's tile in the grid
   */
  get pos(): Position /*string*/ {
    return { row: this._row, col: this._col };
    // return `${this.row},${this.col}`;
  }

  readonly scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;

  /**
   * get a new grid object
   * @param config config object containing a scene, name, spriteName, row, and column
   */
  constructor(config: TileObjectConfig) {
    this.name = config.name;
    this._row = config.row;
    this._col = config.col;
    this.scene = config.scene;
    this.sprite = this.scene.add.sprite(
      (this.col * Grid.tileWidth) + (Grid.tileWidth * 0.5),
      (this.row * Grid.tileHeight) + (Grid.tileHeight * 0.5),
      config.spriteName
    );
    const scaleFactor = Grid.tileWidth / this.sprite.width;
    const ratio = this.sprite.height / this.sprite.width;
    this.sprite.setScale(scaleFactor, scaleFactor * ratio);
    this.addToGrid();
  }

  protected addToGrid() {
    Grid.addTileObj(this);
    console.log("added to grid tile at:", this.pos);
    console.log(`objects at grid tile ${this.pos.row},${this.pos.col}`, Grid.getTile(this.pos));
  }

  protected removeFromGrid() {
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
    this.sprite.x = (this.col * Grid.tileWidth) + (Grid.tileWidth * 0.5);
    this.sprite.y = (this.row * Grid.tileHeight) + (Grid.tileHeight * 0.5);
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

  /**
   * change the object's sprite
   * @param spriteName image key defined in scene preload
   */
  setSprite(spriteName: string) {
    this.sprite.setTexture(spriteName);
  }
}
