import Grid from "./grid";
import { TileObjectConfig } from "./tile-object";
import TileObject from "./tile-object";
import Phaser from "phaser";
import * as Behaviors from "../behaviors/behaviors";

export enum CropType {
  green,
  purple,
  red,
}

export type CropBehavior = (self: Crop) => void;

export interface CropConfig {
  readonly objectConfig: TileObjectConfig;
  readonly type: CropType;
  readonly sprites: string[];
  readonly growthRate: number;
  readonly bestSun: number;
  readonly bestWater: number;
  readonly bestNeighborCount: number;
  readonly turnBehaviors: CropBehavior[];
  readonly levelUpBehaviors: CropBehavior[];
}

const maxSunGrowth = 3;
const maxWaterGrowth = 3;
const maxNeighborGrowth = 3;

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
  readonly bestSun: number;
  readonly bestWater: number;
  readonly bestNeighborCount: number;
  readonly turnBehaviors: CropBehavior[];
  readonly levelUpBehaviors: CropBehavior[];
  static consumed = 0;

  constructor(config: CropConfig) {
    super(config.objectConfig);
    this._level = 0;
    this.sprites = config.sprites;
    this.type = config.type;
    this.growthRate = config.growthRate;
    this.growthProgress = 0;
    this.bestSun = config.bestSun;
    this.bestWater = config.bestWater;
    this.bestNeighborCount = config.bestNeighborCount;
    this.turnBehaviors = config.turnBehaviors;
    this.levelUpBehaviors = config.levelUpBehaviors;
  }

  override takeTurn() {
    if (this.level >= this.sprites.length - 1) {
      return;
    }
    this.growthProgress++;
    this.growthProgress += Math.max(
      maxSunGrowth - Math.abs(Grid.sunLevel - this.bestSun) * maxSunGrowth,
      0
    );
    this.growthProgress += Math.max(
      maxWaterGrowth -
        Math.abs(Grid.getMoisture(this.pos) - this.bestWater) * maxWaterGrowth,
      0
    );
    const neighbors = Grid.getAdjacentTiles(this);
    let sum = 0;
    sum += neighbors.left.length;
    sum += neighbors.right.length;
    sum += neighbors.up.length;
    sum += neighbors.down.length;
    this.growthProgress += Math.max(
      maxNeighborGrowth - Math.abs(sum - this.bestSun),
      0
    );
    this.turnBehaviors.forEach((behavior) => {
      behavior(this);
    });
    if (this.growthProgress >= this.growthRate) {
      this.levelUp();
    }
  }

  levelUp() {
    this._level++;
    this.growthProgress = 0;
    this.setSprite(this.sprites[this.level]);
    this.levelUpBehaviors.forEach((behavior) => {
      behavior(this);
    });
  }

  /**
   * removes the crop from the scene
   * @returns the number of points the crop is worth
   */
  eat(): number {
    this.sprite.destroy();
    this.removeFromGrid();
    Crop.consumed += 1;
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
    let bestSun = 1;
    let bestWater = 1;
    let bestNeighborCount = 0;
    let turnBehaviors: CropBehavior[] = [];
    let levelUpBehaviors: CropBehavior[] = [];

    switch (type) {
      case CropType.green:
        sprites = ["green1", "green2", "green3"];
        name = "green";
        growthRate = 10;
        bestSun = 0.5;
        bestWater = 0.5;
        bestNeighborCount = 0;
        turnBehaviors = [];
        levelUpBehaviors = [];
        break;
      case CropType.purple:
        sprites = ["purple1", "purple2", "purple3"];
        name = "purple";
        growthRate = 14;
        bestSun = 0.2;
        bestWater = 0.8;
        bestNeighborCount = 4;
        turnBehaviors = [];
        levelUpBehaviors = [
          Behaviors.propagate
        ];
        break;
      case CropType.red:
      default:
        sprites = ["red1", "red2", "red3"];
        name = "red";
        growthRate = 6;
        bestSun = 1;
        bestWater = 0.2;
        bestNeighborCount = 2;
        turnBehaviors = [];
        levelUpBehaviors = [];
        break;
    }

    const objConfig = {
      scene: scene,
      name: name,
      spriteName: sprites[0],
      row: Math.floor(y / Grid.tileHeight),
      col: Math.floor(x / Grid.tileWidth),
    };

    const newCrop = new Crop({
      objectConfig: objConfig,
      type: type,
      sprites: sprites,
      growthRate: growthRate,
      bestSun: bestSun,
      bestWater: bestWater,
      bestNeighborCount: bestNeighborCount,
      turnBehaviors: turnBehaviors,
      levelUpBehaviors: levelUpBehaviors,
    });

    return newCrop;
  }
}
