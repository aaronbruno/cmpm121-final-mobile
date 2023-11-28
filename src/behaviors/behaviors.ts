import Crop from "../classes/crop";

/**
 * Spread this crop into the four adjacent tiles.
 * Only plant a new crop if the tile is open.
 * @param self The crop object
 */
export function propagate(self: Crop): void {
    console.log("spread to neighboring tiles");
    console.log(self);
}