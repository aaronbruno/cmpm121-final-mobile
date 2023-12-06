import Phaser from "phaser";
import { Position } from "./grid";
import Grid from "./grid";
import luck from "../luck";

export interface TileObjectConfig {
  readonly scene: Phaser.Scene;
  readonly name: string;
  readonly spriteName: string;
  readonly row: number;
  readonly col: number;
}

export default abstract class TileObject {
  protected view: DataView;

  private nameMap = new Map<number, string>();

  private set name(x: string) {
    this.view.setFloat32(0, luck(x));
    this.nameMap.set(this.view.getFloat32(0), x);
  }
  get name(): string {
    return this.nameMap.get(this.view.getFloat32(0))!;
  }

  private set row(i: number) {
    this.view.setUint32(4, i);
  }
  get row(): number {
    return this.view.getUint32(4);
  }

  private set col(i: number) {
    this.view.setUint32(8, i);
  }
  get col(): number {
    return this.view.getUint32(8);
  }

  static readonly numBytes = 52;

  /**
   * returns the key used to access this object's tile in the grid
   */
  get pos(): Position {
    return { row: this.row, col: this.col };
  }

  readonly scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;

  /**
   * get a new grid object
   * @param config config object containing a scene, name, spriteName, row, and column
   */
  constructor(config: TileObjectConfig) {
    const index = Grid.width * config.row + config.col;
    this.view = new DataView(Grid.buff, index * TileObject.numBytes);
    this.name = config.name;
    this.row = config.row;
    this.col = config.col;
    this.scene = config.scene;
    this.sprite = this.scene.add.sprite(
      this.col * Grid.tileWidth + Grid.tileWidth * 0.5,
      this.row * Grid.tileHeight + Grid.tileHeight * 0.5,
      config.spriteName
    );
    const scaleFactor = Grid.tileWidth / this.sprite.width;
    const ratio = this.sprite.height / this.sprite.width;
    this.sprite.setScale(scaleFactor, scaleFactor * ratio);
    this.addToGrid();
  }

  protected addToGrid() {
    Grid.addTileObj(this);
  }

  protected removeFromGrid() {
    Grid.removeTileObj(this);
  }

  delete() {
    this.sprite.destroy();
    this.removeFromGrid();
  }

  /**
   * get the neighboring TileObjects to this TileObject
   * @returns arrays of neighbors to the left, right, up, and down directions
   */
  getNeighbors(): Map<string, TileObject[]> {
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
    this.row = row;
    this.col = col;
    this.sprite.x = this.col * Grid.tileWidth + Grid.tileWidth * 0.5;
    this.sprite.y = this.row * Grid.tileHeight + Grid.tileHeight * 0.5;
    this.addToGrid();
  }

  /**
   * move the object to a specific grid column, keeping its row position
   * @param col grid column number
   */
  moveToCol(col: number) {
    this.moveToTile(this.row, col);
  }

  /**
   * move the object to a specific grid row, keeping its column position
   * @param row grid row number
   */
  moveToRow(row: number) {
    this.moveToTile(row, this.col);
  }

  /**
   * change the object's sprite
   * @param spriteName image key defined in scene preload
   */
  setSprite(spriteName: string) {
    this.sprite.setTexture(spriteName);
  }
}
