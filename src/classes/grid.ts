import TileObject from "./tile-object";

export interface Position {
  row: number;
  col: number;
}

export default class Grid {
  // forEachTile(arg0: (tile: Tile) => void) {
  //   throw new Error("Method not implemented.");
  // }
  forEachTile(callback: (tile: TileObject) => void) {
    for (const [, objs] of Grid.tiles) {
      for (const obj of objs) {
        callback(obj);
      }
    }
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

  private static tiles = new Map<Position, TileObject[]>();
  /**
   * @param width the width of the grid in tiles
   * @param height the height of the grid in tiles
   */
  constructor(
    readonly width: number,
    readonly height: number,
    readonly tileWidth: number,
    readonly tileHeight: number,
    readonly scene: Phaser.Scene,
  ) {
    Grid._width = width;
    Grid._height = height;
    Grid._tileWidth = tileWidth;
    Grid._tileHeight = tileHeight;
    Grid._scene = scene;
  }

  public static getTile(pos: Position): TileObject[] {
    if (!Grid.tiles.has(pos)) {
      Grid.tiles.set(pos, []);
    }
    return Grid.tiles.get(pos)!;
  }

  public static addTileObj(obj: TileObject) {
    if (
      obj.pos >= { row: 0, col: 0 } &&
      obj.pos < { row: Grid._width, col: Grid._height }
    )
      if (!Grid.tiles.has(obj.pos)) {
        Grid.tiles.set(obj.pos, []);
      }

    Grid.tiles.get(obj.pos)?.push(obj);
  }

  public static removeTileObj(obj: TileObject) {
    const objs = Grid.tiles.get(obj.pos);
    objs?.splice(objs.indexOf(obj), 1);
  }

  public static getAdjacentTiles(obj: TileObject): {
    left: TileObject[];
    right: TileObject[];
    up: TileObject[];
    down: TileObject[];
  } {
    const center = obj.pos;
    return {
      left: Grid.getTile({ row: center.row - 1, col: center.col}),
      right: Grid.getTile({ row: center.row + 1, col: center.col}),
      up: Grid.getTile({ row: center.row, col: center.col - 1 }),
      down: Grid.getTile({ row: center.row, col: center.col + 1 }),
    };
  }

  public static nextTurn() {
    for (const [, objs] of Grid.tiles) {
      for (const obj of objs) {
        obj.takeTurn();
      }
    }
  }

  public static drawTiles() {
    const map = Grid._scene.make.tilemap({key:"map"});
    const tileset = map.addTilesetImage("farmtiles");
    map.createLayer(0, tileset!, 0, 0)!.setScale(8);
  }
}
