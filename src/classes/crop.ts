import Grid from "./grid";
import { TileObjectConfig } from "./tile-object";
import TileObject from "./tile-object";
import Phaser from "phaser";

export enum CropType {
  green,
  purple,
  red,
}

// crop class for growing and harvesting crops

export default class Crop extends TileObject {
  private _level: number;
  public get level(): number {
    return this._level;
  }
  readonly sprites: string[];

  readonly type: CropType;
  readonly growthRate: number; // number of turns to grow another level
  private growthProgress: number; // number of turns taken towards next level

  constructor(
    type: CropType,
    growthRate: number,
    sprites: string[],
    config: TileObjectConfig
  ) {
    super(config);
    this._level = 0;
    this.sprites = sprites;
    this.type = type;
    this.growthRate = growthRate;
    this.growthProgress = 0;
  }

  override takeTurn() {
    if (this.level >= this.sprites.length - 1) {
      return;
    }
    this.growthProgress++; // += Grid.getTile(this.pos).sunlight + Grid.getTile(this.pos).water
    if (this.growthProgress >= this.growthRate) {
      this.levelUp();
    }
  }

  levelUp() {
    this._level++;
    this.growthProgress = 0;
    this.setSprite(this.sprites[this.level]);
  }

  /**
   * removes the crop from the scene
   * @returns the number of points the crop is worth
   */
  eat(): number {
    this.sprite.destroy();
    this.removeFromGrid();
    return this.level * this.growthRate;
  }

  /**
   * Factory to create new crops
   * @param scene the phaser scene this crop is being added to
   * @param type the crop type to be planted
   * @param x the pixel position of the placement, will be converted to grid column number
   * @param y the pixel position of the placement, will be converted to grid row number
   * @returns the crop that was planted
   */
  static plantCrop(
    scene: Phaser.Scene,
    type: CropType,
    x: number,
    y: number
  ): Crop {
    let sprites: string[] = [];
    let name = "";
    let growthRate = 10;

    switch (type) {
      case CropType.green:
        sprites = ["green1", "green2", "green3"];
        name = "green";
        growthRate = 10;
        break;
      case CropType.purple:
        sprites = ["purple1", "purple2", "purple3"];
        name = "purple";
        growthRate = 14;
        break;
      case CropType.red:
      default:
        sprites = ["red1", "red2", "red3"];
        name = "red";
        growthRate = 6;
        break;
    }

    const newCrop = new Crop(type, growthRate, sprites, {
      scene: scene,
      name: name,
      spriteName: sprites[0],
      row: Math.floor(y / Grid.tileHeight),
      col: Math.floor(x / Grid.tileWidth),
    });

    return newCrop;
  }
}
