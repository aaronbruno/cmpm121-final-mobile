interface GridConfig {
  readonly rows: number;
  readonly columns: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly width: number;
  readonly height: number;
  readonly avgSun: number;
  readonly avgWater: number;
}

async function getGridConfig(): Promise<GridConfig> {
  const response = await fetch("./assets/grid-config.json")
    .then(response => {
      return response.json();
    }) as GridConfig;

    return response;
}

export const gridConfig = await getGridConfig().then(result => {
  return result;
});