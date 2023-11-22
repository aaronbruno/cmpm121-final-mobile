import TileObject from "./tile-object";

export interface Position {
  row: number;
  col: number;
}

export default class Grid {
  static readonly width: number;
  static readonly height: number;

  static readonly tileWidth: number;
  static readonly tileHeight: number;

  private static tiles = new Map<Position, TileObject[]>();
  /**
   * @param width the width of the grid in tiles
   * @param height the height of the grid in tiles
   */
  constructor(
    readonly width: number,
    readonly height: number,
    readonly tileWidth: number,
    readonly tileHeight: number
  ) {}

  public static getTile(pos: Position): TileObject[] {
    if (!Grid.tiles.has(pos)) {
      Grid.tiles.set(pos, []);
    }
    return Grid.tiles.get(pos)!;
  }

  public static addTileObj(obj: TileObject) {
    if (
      obj.pos >= { row: 0, col: 0 } &&
      obj.pos < { row: Grid.width, col: Grid.height }
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
}
