interface Position {
    row: number,
    col: number,
}

interface TileObject {
    pos: Position;
  }

export default class Grid {
  private static tiles = new Map<Position, TileObject>;
  /**
   * @param width the width of the grid in tiles
   * @param height the height of the grid in tiles
   */
  constructor(readonly width: number, readonly height: number) {}

  public static hasTileObj(pos: Position): boolean {
    return Grid.tiles.has(pos);
  }

  public static getTileObj(pos: Position): TileObject {
    return Grid.tiles.get(pos)!;
  }

  public static setTileObj(obj: TileObject) {
    Grid.tiles.set(obj.pos, obj);
  }

}