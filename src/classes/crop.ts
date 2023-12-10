import Grid from "./grid";
import { TileObjectConfig } from "./tile-object";
import TileObject from "./tile-object";
import Phaser from "phaser";
import * as Behaviors from "../behaviors/behaviors";
import luck from "../luck";

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
  private set level(i: number) {
    this.view.setUint32(12, i);
  }
  public get level(): number {
    return this.view.getUint32(12);
  }
  public setLevel(level: number) {
    this.view.setUint32(12, level);
    this.setSprite(this.sprites[level]);
  }

  private spritesMap = new Map<number, string[]>();

  private set sprites(x: string[]) {
    this.view.setFloat32(16, luck(x.join()));
    this.spritesMap.set(this.view.getFloat32(16), x);
  }
  get sprites(): string[] {
    return this.spritesMap.get(this.view.getFloat32(16))!;
  }

  private set type(t: CropType) {
    this.view.setUint32(20, t as number);
  }
  public get type(): CropType {
    return this.view.getUint32(20) as CropType;
  }

  // number of turns to grow another level
  public set growthRate(i: number) {
    this.view.setUint32(24, i);
  }
  public get growthRate(): number {
    return this.view.getUint32(24);
  }

  // number of turns taken towards next level
  public set growthProgress(i: number) {
    this.view.setUint32(28, i);
  }
  public get growthProgress(): number {
    return this.view.getUint32(28);
  }

  private set bestSun(i: number) {
    this.view.setFloat32(32, i);
  }
  public get bestSun(): number {
    return this.view.getFloat32(32);
  }

  private set bestWater(i: number) {
    this.view.setFloat32(36, i);
  }
  public get bestWater(): number {
    return this.view.getFloat32(36);
  }

  private set bestNeighborCount(i: number) {
    this.view.setFloat32(40, i);
  }
  public get bestNeighborCount(): number {
    return this.view.getFloat32(40);
  }

  private cropBehaviorsMap = new Map<number, CropBehavior[]>();

  private set turnBehaviors(x: CropBehavior[]) {
    this.view.setFloat32(44, luck(x.join()));
    this.cropBehaviorsMap.set(this.view.getFloat32(44), x);
  }
  get turnBehaviors(): CropBehavior[] {
    return this.cropBehaviorsMap.get(this.view.getFloat32(44))!;
  }

  // readonly levelUpBehaviors: CropBehavior[];
  private set levelUpBehaviors(x: CropBehavior[]) {
    this.view.setFloat32(48, luck(x.join()));
    this.cropBehaviorsMap.set(this.view.getFloat32(48), x);
  }
  get levelUpBehaviors(): CropBehavior[] {
    return this.cropBehaviorsMap.get(this.view.getFloat32(48))!;
  }

  static consumed = 0;

  constructor(config: CropConfig) {
    super(config.objectConfig);
    this.level = 0;
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
    let sum = 0;
    for (const neighbor of Grid.getAdjacentTiles(this).values()) {
      sum += neighbor.length;
    }
    this.growthProgress += Math.max(
      maxNeighborGrowth - Math.abs(sum - this.bestNeighborCount),
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
    this.setLevel(this.level + 1);
    this.growthProgress = 0;
    this.setSprite(this.sprites[this.level]);

    // Check if turn behaviors are defined before iterating over them
    if (this.levelUpBehaviors) {
      this.levelUpBehaviors.forEach((behavior) => {
        behavior(this);
      });
    }
  }

  getMoistureLevel(): number {
    return Grid.getMoisture(this.pos);
  }

  /**
   * removes the crop from the scene
   * @returns the number of points the crop is worth
   */
  eat(): number {
    if (this.level < this.sprites.length - 1) {
      return -1;
    }
    this.delete();
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
    y: number,
    hasPropagationBehavior = true
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
        turnBehaviors = [Behaviors.racistPlant];
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
        levelUpBehaviors = [Behaviors.propagate];
        break;
      case CropType.red:
      default:
        sprites = ["red1", "red2", "red3"];
        name = "red";
        growthRate = 6;
        bestSun = 1;
        bestWater = 0.2;
        bestNeighborCount = 2;
        turnBehaviors = [Behaviors.lateBloomer];
        levelUpBehaviors = [Behaviors.duplication];
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
      levelUpBehaviors: hasPropagationBehavior ? levelUpBehaviors : [],
    });

    return newCrop;
  }
}
