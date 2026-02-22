import { _decorator } from 'cc';
import { generateTiles } from './LevelGenerator';
import { LevelConfig, TileData } from './GameTypes';

const { ccclass } = _decorator;

@ccclass('BoardManager')
export class BoardManager {
  private tiles: TileData[] = [];

  public build(level: LevelConfig): TileData[] {
    this.tiles = generateTiles(level);
    return this.tiles;
  }

  public pick(tileId: number): TileData {
    const tile = this.tiles.find((item) => item.tileId === tileId);
    if (!tile) {
      throw new Error(`Tile ${tileId} not found`);
    }

    this.tiles = this.tiles.filter((item) => item.tileId !== tileId);
    this.tiles.forEach((item) => {
      item.blockedBy = item.blockedBy.filter((id) => id !== tileId);
    });

    return tile;
  }

  public isClear(): boolean {
    return this.tiles.length === 0;
  }

  public getClickableTiles(): TileData[] {
    return this.tiles.filter((item) => item.blockedBy.length === 0);
  }
}
