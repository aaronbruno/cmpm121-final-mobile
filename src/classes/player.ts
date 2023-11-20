import GridObject from "./grid-object";

// player state

export default class Player extends GridObject {
    override takeTurn() {
      console.log("player take turn");
    }
  }