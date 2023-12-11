interface GridConfig {
  readonly rows: number;
  readonly columns: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly width: number;
  readonly height: number;
  avgSun: number;
  sunWeight: number;
  avgWater: number;
  waterWeight: number;
}

enum EventType {
  none = "none",
  rain = "rain",
  drought = "drought"
}

interface EventConfig {
  readonly turn: number;
  readonly event: string;
  readonly duration: number;
}

import config from "../public/assets/grid-config.json";

export const gridConfig = config as GridConfig;

const originalConfig = JSON.parse(JSON.stringify(gridConfig)) as GridConfig;

const gameEvents: EventType[] = [];

import eventConfig from "../public/assets/event-config.json";

function parseEventConfig() {
  const eventList = eventConfig as EventConfig[];
  for (const event of eventList) {
    while (gameEvents.length < event.turn) {
      gameEvents.push(EventType.none);
    }
    for (let i = 0; i < event.duration; i++) {
      gameEvents.push(event.event as EventType);
    }
  }
}

parseEventConfig();

export function updateGridConfig(turnNum: number) {
  const event = gameEvents[turnNum % gameEvents.length];
  switch(event){
    case EventType.none:
      gridConfig.avgSun = originalConfig.avgSun;
      gridConfig.sunWeight = originalConfig.sunWeight;
      gridConfig.avgWater = originalConfig.avgWater;
      gridConfig.waterWeight = originalConfig.waterWeight;
      break;
    case EventType.rain:
      gridConfig.avgWater = 0.9;
      gridConfig.waterWeight = 3;
      gridConfig.avgSun = 0.1;
      gridConfig.sunWeight = 3;
      break;
    case EventType.drought:
      gridConfig.avgWater = 0.1;
      gridConfig.waterWeight = 3;
      gridConfig.avgSun = 0.9;
      gridConfig.sunWeight = 3;
      break;
  }
}