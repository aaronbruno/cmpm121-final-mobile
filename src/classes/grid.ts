import TileObject from "./tile-object";
import luck from "../luck";
import SaveManager from "../saves/save-manager";

export interface Position {
  row: number;
  col: number;
}

export default class Grid {
  // forEachTile(arg0: (tile: Tile) => void) {
  //   throw new Error("Method not implemented.");
  // }
  static forEachTile(callback: (tile: TileObject) => void) {
    for (const [, objs] of Grid.tiles) {
      for (const obj of objs) {
        callback(obj);
      }
    }
  }

  public static getTileObject(pos: Position): TileObject | undefined {
    const key = Grid.getKey(pos);
    const tiles = Grid.tiles.get(key);
    if (tiles && tiles.length > 0) {
      return tiles[0];
    }
    return undefined;
  }

  private static _width: number;
  public static get width(): number {
    return this._width;
  }
  private static _height: number;
  public static get height(): number {
    return this._height;
  }

  private static _tileWidth: number;
  public static get tileWidth(): number {
    return this._tileWidth;
  }
  private static _tileHeight: number;
  public static get tileHeight(): number {
    return this._tileHeight;
  }

  private static _scene: Phaser.Scene;
  public static get scene(): Phaser.Scene {
    return this._scene;
  }

  public static get sunLevel(): number {
    return luck(String(SaveManager.curTurn));
  }

  private static _turnNumber: number;
  public static get turnNumber(): number {
    return this._turnNumber;
  }

  private static buff: ArrayBuffer;

  private static maxObjsPerTile = 2;

  private static tiles = new Map<string, TileObject[]>();
  /**
   * @param width the width of the grid in tiles
   * @param height the height of the grid in tiles
   */
  constructor(
    readonly width: number,
    readonly height: number,
    readonly tileWidth: number,
    readonly tileHeight: number,
    readonly scene: Phaser.Scene
  ) {
    Grid._width = width;
    Grid._height = height;
    Grid._tileWidth = tileWidth;
    Grid._tileHeight = tileHeight;
    Grid._scene = scene;
    Grid._turnNumber = 0;

    Grid.buff = new ArrayBuffer(
      Grid.width * Grid.height * TileObject.numBytes * Grid.maxObjsPerTile
    );
    console.log(Grid.buff);
  }

  public static getKey(pos: Position): string {
    return `${pos.row},${pos.col}`;
  }

  public static getTile(pos: Position): TileObject[] {
    const key = Grid.getKey(pos);
    if (!Grid.tiles.has(key)) {
      Grid.tiles.set(key, []);
    }
    return Grid.tiles.get(key)!;
  }

  public static addTileObj(obj: TileObject) {
    const key = Grid.getKey(obj.pos);
    if (
      obj.pos >= { row: 0, col: 0 } &&
      obj.pos < { row: Grid._width, col: Grid._height }
    ) {
      if (!Grid.tiles.has(key)) {
        Grid.tiles.set(key, []);
      }
    }

    Grid.tiles.get(key)?.push(obj);
  }

  public static removeTileObj(obj: TileObject) {
    const key = Grid.getKey(obj.pos);
    const objs = Grid.tiles.get(key);
    objs?.splice(objs.indexOf(obj), 1);
  }

  public static getAdjacentTiles(obj: TileObject): Map<string, TileObject[]> {
    const center = obj.pos;
    return new Map([
      ["left", Grid.getTile({ row: center.row - 1, col: center.col })],
      ["right", Grid.getTile({ row: center.row + 1, col: center.col })],
      ["up", Grid.getTile({ row: center.row, col: center.col - 1 })],
      ["down", Grid.getTile({ row: center.row, col: center.col + 1 })],
    ]);
  }

  public static nextTurn() {
    for (const [, objs] of Grid.tiles) {
      for (const obj of objs) {
        obj.takeTurn();
      }
    }
  }

  public static getMoisture(pos: Position) {
    return luck(Grid.getKey(pos) + String(SaveManager.curTurn));
  }

  public static drawTiles() {
    const map = Grid._scene.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("farmtiles");
    map.createLayer(0, tileset!, 0, 0)!.setScale(8);
  }
}
