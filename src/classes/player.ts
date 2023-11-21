import TileObject from "./tile-object";

// player state

export default class Player extends TileObject {
    override takeTurn() {
      console.log("player take turn");
    }
  }