import Phaser from "phaser";
import Grid from "../classes/grid";
import Crop, { CropType } from "../classes/crop";
import Player from "../classes/player";

interface CropSaveObj {
  type: CropType;
  level: number;
  growthProgress: number;
  row: number;
  col: number;
}

interface SaveData {
  crops: CropSaveObj[];
  pos: { x: number; y: number };
  score: number;
}

export default class SaveManager {
  static curTurn: number;
  static maxTurn: number;
  static isMostRecentTurn = true;
  static player: Player;
  static scene: Phaser.Scene;

  static setPlayer(player: Player) {
    SaveManager.player = player;
  }

  static setScene(scene: Phaser.Scene) {
    SaveManager.scene = scene;
  }

  /**
   * load the current turn number to use as a key to get save data
   */
  static loadCurTurn() {
    const result = localStorage.getItem("curTurn");
    const maxTurn = localStorage.getItem("maxTurn");
    if (result) {
      SaveManager.curTurn = parseInt(result);
      SaveManager.maxTurn = parseInt(maxTurn!);
    } else {
      SaveManager.curTurn = 0;
    }
  }

  /**
   * undo the last turn
   */
  static undo() {
    if (SaveManager.curTurn <= 0) return;
    SaveManager.curTurn--;
    SaveManager.load();
    localStorage.setItem("curTurn", String(this.curTurn));
    SaveManager.isMostRecentTurn = false;
  }

  /**
   * redo the previously undone turn
   */
  static redo() {
    if (SaveManager.isMostRecentTurn) return;
    SaveManager.curTurn++;
    SaveManager.load();
    localStorage.setItem("curTurn", String(this.curTurn));
    if (SaveManager.curTurn == SaveManager.maxTurn) {
      SaveManager.isMostRecentTurn = true;
    }
  }

  /**
   * save game state to localStorage, uses curTurn
   */
  static save() {
    const crops = SaveManager.getCropList();
    const saveObj = {
      crops: crops,
      pos: {x: this.player.x, y: this.player.y},
      score: Crop.consumed
    };
    localStorage.setItem(String(this.curTurn), JSON.stringify(saveObj));
    localStorage.setItem("curTurn", String(this.curTurn));
    SaveManager.maxTurn = this.curTurn;
    localStorage.setItem("maxTurn", String(this.maxTurn));
    SaveManager.isMostRecentTurn = true;
    this.curTurn++;

  }

  /**
   * creates array of crop save objects
   * @returns array of save objects
   */
  static getCropList(): CropSaveObj[] {
    const cropList: CropSaveObj[] = [];
    Grid.forEachTile(tile => {
      const crop = tile as Crop;
      cropList.push({
        type: crop.type,
        level: crop.level,
        growthProgress: crop.growthProgress,
        row: crop.row,
        col: crop.col
      });
    });
    return cropList;
  }

  /**
   * restore the game state from a given save, uses curTurn
   */
  static load() {
    const savedData = localStorage.getItem(String(this.curTurn));

    if (savedData) {
      const parsedData = JSON.parse(savedData) as SaveData;
  
      // Load player position
      if (parsedData.pos) {
        this.player.x = parsedData.pos.x;
        this.player.y = parsedData.pos.y;
      }

      Grid.forEachTile(obj => {
        obj.delete();
      });
  
      parsedData.crops.forEach(save => { 
        // Create a new Crop instance with updated properties
        const updatedCrop = Crop.plantCrop(
          this.scene,
          save.type,
          save.col * Grid.tileHeight,
          save.row * Grid.tileWidth
        );
        
        updatedCrop.setLevel(save.level);
        updatedCrop.growthProgress = save.growthProgress;
      });

      // Load score
      Crop.consumed = parsedData.score || 0;
    }
  }
}
