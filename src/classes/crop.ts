import TileObject from "./tile-object";

// crop class for growing and harvesting plants

export default class Crop extends TileObject {
  override takeTurn() {
    console.log("crop take turn");
  }
}
