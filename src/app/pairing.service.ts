import { Injectable } from '@angular/core';
import { Player } from './model/player.model';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  players: string[] = [];
  playerQueue: string[] = [];

  playersAvailable: string[] = [];
  playersInGame: string[] = [];
  playersInRest: string[] = [];

  pairings: { name: string, gamesPlayed: number }[][] = [];

  playerGamesMap = new Map<string, number>();

  playerList: Player[] = [];

  setPlayers(players: string[]) {
    this.players = players;
    this.playerQueue = players.slice(); // Initialize the playerQueue with players
    const latestPlayer = players[players.length - 1];
    this.playerGamesMap.set(latestPlayer, 0);
    this.setPlayersAvailable(latestPlayer);

  }

  addPlayer(player : string) {
    const newPlayer = new Player(player, 0, "Available");
    this.playerList.push(newPlayer);
  }

  removePlayer(player : string) {
    const updatedPlayerList = this.playerList.filter(inPlayer => inPlayer.getName() !== player);
    this.playerList = updatedPlayerList;
  }

  generatePairings():{ name: string, gamesPlayed: number }[][] {
    this.pairings = [];
    const totalPlayers = this.players.length;
    const pairsPerGame = 2;
    const minGames = 5;
    const games = Math.max(minGames, totalPlayers / (pairsPerGame * 2));

    const playersWithGames = this.players.map((player) => ({
      name: player,
      gamesPlayed: this.playerGamesMap.get(player) || 0, // Default to 0 if player not found in playerGamesMap
    }));

    for (let game = 0; game < games; game++) {
      const shuffledPlayers = this.shuffleArrayWithGames(playersWithGames);
      // const playersCopy = this.shuffleArray(this.players.slice());
      const pairing: { name: string, gamesPlayed: number }[] = [];

      // for (let pairIndex = 0; pairIndex < pairsPerGame; pairIndex++) {
      //   const startIndex = pairIndex * 4;

        // let player1 = shuffledPlayers[startIndex];
        // let player2 = shuffledPlayers[startIndex + 1];
        // let player3 = shuffledPlayers[startIndex + 2];
        // let player4 = shuffledPlayers[startIndex + 3];

        let player1: { name: string, gamesPlayed: number } = { name: shuffledPlayers[0].name, gamesPlayed: shuffledPlayers[0].gamesPlayed };
        let player2: { name: string, gamesPlayed: number } = { name: shuffledPlayers[1].name, gamesPlayed: shuffledPlayers[1].gamesPlayed };
        let player3: { name: string, gamesPlayed: number } = { name: shuffledPlayers[2].name, gamesPlayed: shuffledPlayers[2].gamesPlayed };
        let player4: { name: string, gamesPlayed: number } = { name: shuffledPlayers[3].name, gamesPlayed: shuffledPlayers[3].gamesPlayed };


        if (player1 && player2 && player3 && player4) {
          // const pair: [] = [player1, player2, player3, player4];
          pairing.push(player1, player2, player3, player4);
        }
      // }

      this.pairings.push(pairing);
    }

    return this.pairings;
  }

  shuffleArrayWithGames(array: any[]): any[] {
    // Sort the array based on the number of games played in ascending order
    const sortedArray = array.sort((a, b) => a.gamesPlayed - b.gamesPlayed);

    // Perform the Fisher-Yates shuffle on the sorted array
    const length = sortedArray.length;
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sortedArray[i], sortedArray[j]] = [sortedArray[j], sortedArray[i]];
    }

    return sortedArray;
  }

  updatePairing(): object[][] {
    // Implement your logic to update pairings if a player cannot play on their game.
    // You can update the pairings array and return it here.

    return this.pairings;
  }

  updatePlayerQueue(playerQueue: string[]): void {
    this.playerQueue = playerQueue;
  }

  getPlayerFromQueue(): string {
    if (this.playerQueue.length > 0) {
      return this.playerQueue.shift()!;
    } else {
      return '';
    }
  }

  getPlayerGamesMap(): Map<string, number> {
    return this.playerGamesMap;
  }

  getPlayersAvailable(): string[] {
    return this.playersAvailable;
  }

  setPlayersAvailable(player: string): void {
    this.playersAvailable.push(player);
  }

  removePlayersAvailable(player: string): void {
    this.playersAvailable.pop();
  }

  getPlayersInGame(): string[] {
    return this.playersInGame;
  }

  setPlayersInGame(player: string): void {
    this.playersInGame.push(player);
  }

  removePlayersInGame(player: string): void {
    this.playersInGame.pop();
  }

  getPlayersInRest(): string[] {
    return this.playersInRest;
  }

  setPlayersInRest(player: string): void {
    this.playersInRest.push(player);
  }

  removePlayersInRest(player: string): void {
    this.playersInRest.pop();
  }

  executeRestPeriod(): void {
    if (this.playersInRest.length > 0) {
      setTimeout(() => {
        const player = this.playersInRest.pop();
        if (player !== undefined) {
          this.setPlayersAvailable(player);
        }
      }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }
  }
}
