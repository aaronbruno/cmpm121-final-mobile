import {TileObjectConfig } from "./tile-object";
import TileObject from "./tile-object";

export enum CropType {
  green,
  purple,
  red
}

// plant class for growing and harvesting plants

export default class Crop extends TileObject {
  private _level: number;
  public get level(): number {
    return this._level; 
  }
  readonly type: CropType;
  readonly growthRate: number; // number of turns to grow another level

  constructor(type: CropType, growthRate: number, config: TileObjectConfig) {
    super(config);
    this._level = 0;
    this.type = type;
    this.growthRate = growthRate;
    this.growthProgress = 0;
  }

  private growthProgress: number;

  override takeTurn() {
    this.growthProgress++;
    if (this.growthProgress >= this.growthRate) {
      this.levelUp();
      this.growthProgress = 0;
    }
  }

  levelUp() {
    console.log("level up");
    this._level++;
  }
}
