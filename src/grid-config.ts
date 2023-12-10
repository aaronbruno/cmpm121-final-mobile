interface GridConfig {
  readonly rows: number;
  readonly columns: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly width: number;
  readonly height: number;
  readonly avgSun: number;
  readonly sunWeight: number;
  readonly avgWater: number;
  readonly waterWeight: number;
}

import config from "../public/assets/grid-config.json";

export const gridConfig = config as GridConfig;