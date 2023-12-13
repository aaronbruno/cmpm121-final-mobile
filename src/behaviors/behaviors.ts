import Crop from "../classes/crop";
import Grid from "../classes/grid";

export interface Position {
  row: number;
  col: number;
}
/**
 * Spread this crop into the four adjacent tiles.
 * Only plant a new crop if the tile is open.
 * @param self The crop object
 */
export function propagate(self: Crop): void {
  console.log("Propagate Behavior:");

  // Define the relative positions of adjacent tiles
  const relativePositions: Position[] = [
    { row: self.row - 1, col: self.col }, // up
    { row: self.row + 1, col: self.col }, // down
    { row: self.row, col: self.col - 1 }, // left
    { row: self.row, col: self.col + 1 }, // right
  ];

  // Iterate over all adjacent positions
  for (const position of relativePositions) {
    const { row, col } = position;

    // Check if the target tile is within the grid bounds
    if (row >= 0 && row < Grid.height && col >= 0 && col < Grid.width) {
      // Get the tile object at the target position
      const targetTile = Grid.getTileObject(position);

      // Check if the target tile is not occupied by a crop
      if (!(targetTile instanceof Crop)) {
        const tileX: number = col * Grid.tileWidth;
        const tileY: number = row * Grid.tileHeight;
        console.log(`Current tile: ${row}, ${col}`);
        console.log(`Calculated tile position: ${tileX}, ${tileY}`);

        Crop.plantCrop(self.scene, self.type, tileX, tileY, false);

        console.log(`Planted tile: ${row}, ${col}`);
      } else {
        console.log(
          `Tile at ${row}, ${col} is occupied by a crop; no crop planted.`
        );
      }
    } else {
      console.log(
        `Tile at ${row}, ${col} is outside grid bounds; no crop planted.`
      );
    }
  }
}

/**
 * If there is at least 1 other adjacent crop 
 * of same type, spawn another crop (of same type) 
 * in one of the other adjacent tiles
 * @param self The crop object
 */
export function duplication(self: Crop): void {
  console.log("Duplication Behavior:");

  // Define the relative positions of adjacent tiles
  const relativePositions: Position[] = [
    { row: self.row - 1, col: self.col }, // up
    { row: self.row + 1, col: self.col }, // down
    { row: self.row, col: self.col - 1 }, // left
    { row: self.row, col: self.col + 1 }, // right
  ];

  // Filter adjacent tiles to include only unoccupied tiles with the same crop type
  const eligibleTiles = relativePositions
    .map((position) => {
      const { row, col } = position;
      if (row >= 0 && row < Grid.height && col >= 0 && col < Grid.width) {
        const targetTile = Grid.getTileObject(position);

        // Check if the target tile is an instance of Crop
        if (targetTile instanceof Crop && targetTile.type === self.type) {
          return position;
        }

        // Check if the target tile is unoccupied
        if (!(targetTile instanceof Crop)) {
          return position;
        }
      }
      return null;
    })
    .filter((position) => position !== null) as Position[];

  // If there are eligible tiles, spawn a new crop in one of them
  if (eligibleTiles.length > 0) {
    const randomPosition =
      eligibleTiles[Math.floor(Math.random() * eligibleTiles.length)];
    const { row, col } = randomPosition;
    console.log(`Spawning new crop at (${row}, ${col})`);

    // Try to spawn a new crop in one of the eligible tiles
    const newCrop = Crop.plantCrop(
      self.scene,
      self.type,
      col * Grid.tileWidth,
      row * Grid.tileHeight,
      false
    );

    // If the new crop was successfully planted, log it; otherwise, log an error
    if (newCrop) {
      console.log(`Successfully spawned new crop at (${row}, ${col})`);
    } else {
      console.error("Failed to spawn new crop; target tile is occupied.");
    }
  } else {
    console.log(
      "No adjacent unoccupied tiles of the same type; no duplication."
    );
  }
}

/**
 * Crop takes twice as long to grow, 
 * regardless of any other conditions
 * @param self
 */
export function lateBloomer(self: Crop): void {
  console.log("Late Bloomer Behavior:");
  console.log(`Old growth rate: ${self.growthRate}`);
  self.growthRate += 3;
  console.log(`New growth rate: ${self.growthRate}`);
}

/**
 * If there are more than 2 adjacent crops of different crop type,
 * then destroy 1 adjacent crop at random.
 * @param self
 */
export function racistPlant(self: Crop): void {
  console.log("Racist Plant Behavior:");

  let adjacentCrops = 0;
  const differentTypeCrops: Crop[] = [];

  for (const neighbor of Grid.getAdjacentTiles(self).values()) {
    adjacentCrops += neighbor.filter((obj) => obj instanceof Crop).length;

    neighbor.forEach((obj) => {
      if (obj instanceof Crop && obj.type !== self.type) {
        differentTypeCrops.push(obj);
      }
    });
  }

  if (adjacentCrops > 2 && differentTypeCrops.length > 0) {
    const randomCrop =
      differentTypeCrops[Math.floor(Math.random() * differentTypeCrops.length)];

    if (randomCrop) {
      console.log(
        `Destroying adjacent crop at (${randomCrop.row}, ${randomCrop.col})`
      );

      Grid.removeTileObj(randomCrop);
      randomCrop.sprite.destroy();
    }
  }
}
