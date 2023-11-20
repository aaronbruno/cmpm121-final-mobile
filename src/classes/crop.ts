import GridObject from "./grid-object";

// crop class for growing and harvesting plants

export default class Crop extends GridObject {
  override takeTurn() {
    console.log("crop take turn");
  }
}
