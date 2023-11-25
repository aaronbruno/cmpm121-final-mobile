interface GridConfig {
  readonly rows: number;
  readonly columns: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly width: number;
  readonly height: number;
}

export const gridConfig: GridConfig = {
  rows: 10,
  columns: 10,
  tileWidth: 128,
  tileHeight: 128,
  height: 10 * 128,
  width: 10 * 128,
};
