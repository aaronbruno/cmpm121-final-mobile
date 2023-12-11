## Devlog Entry - 12/6

[Back To README](../README.md)

### How we satisfied the software requirements

**[F0.a] You control a character moving on a 2D grid.**\
Same as last week.

**[F0.b] You advance time in the turn-based simulation manually.**\
Same as last week.

**[F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.**\
Same as last week.

**[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.**\
Same as last week.

**[F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).**\
Same as last week.

**[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).**\
Same as last week.

**[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).**\
Same as last week.

**[F1.a] The important state of each cell of your game’s grid must be backed by a single contiguous byte array in AoS or SoA format. Your team must statically allocate memory usage for the whole grid.**\
Same as last week.

**[F1.b] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times.**\
Same as last week.

**[F1.c] The player must be able to manually save their progress in the game in a way that allows them to load that save and continue play another day. The player must be able to manage multiple save files (allowing save scumming).**\
Same as last week.

**[F1.d] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.c.)**\
Same as last week.

**[F2.a] External DSL for scenario designs.**\
We created two JSON files: grid-config.json and event-config.json. The grid config file describes the basic level set-up. This includes the size of the grid, and the normal distribution for sun and water levels. The event config file contains a list of events. Each event is an object that has fields for the type of event, which turn the event will start on, and how long the event will last for. We have a rain and a drought event, which move the normal distribution of sun and water.
```
{
    "turn": 10,
    "event": "rain",
    "duration": 5
}
```

**[F2.b] Internal DSL for plant types and growth conditions.**\
Each crop type is described using a CropConfig object. The prototype for that object has the fields:

- objectConfig: A separate config for describing the crop's column and row number, and its starting sprite.
- type: The type of crop.
- sprites: An array of sprites for each growth level.
- growthRate: The threshold where the crop will grow to the next level.
- bestSun: The preferred sun level.
- bestWater: The preferred water level.
- bestNeighborCount: The preferred neighbor count.
- turnBehaviors: An array of functions that will be called when the crop takes its turn.
- levelUpBehaviors: An array of functions that will be called with the crop levels up.

The behavior arrays allowed our design lead, Aaron Bruno, to make crops wildly different from one another. For example, the purple mushroom will spread itself into neighboring tiles, and the green mushroom will destroy neighboring crops that aren't the same type. These behaviors are defined in the behaviors.ts file, such as this:
```
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
```

then can be used in the plantCrop() method to define a crop's behavior:

```
case CropType.purple:
    sprites = ["purple1", "purple2", "purple3"];
    name = "purple";
    growthRate = 14;
    bestSun = 0.2;
    bestWater = 0.8;
    bestNeighborCount = 4;
    turnBehaviors = [];
    levelUpBehaviors = [Behaviors.propagate];
    break;
```

### Reflection
