import { Injectable, EventEmitter } from '@angular/core';
import { Game } from '../models/game.model';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private storageKey = 'game';
  games: Game[] = [];
  gamesDataChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(private playerService: PlayerService) {
    this.loadGameListFromStorage();
  }

  private loadGameListFromStorage(): void {
    const storedGameList = localStorage.getItem(this.storageKey);
    if (storedGameList) {
      this.games = JSON.parse(storedGameList);
    }
  }

  private saveGameListToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.games));
  }

  createGame() {
    const availablePlayers = this.playerService.getAvailablePlayers();
    if (availablePlayers.length >= 4) {

      const sortedPlayers = this.playerService.sortPlayersByGamesPlayed(availablePlayers);
      const team1 = sortedPlayers.slice(0, 2);
      const team2 = sortedPlayers.slice(2, 4);
      const game: Game = {
        player1: team1[0].name,
        player2: team1[1].name,
        player3: team2[0].name,
        player4: team2[1].name,
        status: 'Not Started'
      };
      this.games.push(game);
      this.saveGameListToStorage();
    }
  }

  startGame(game: Game) {
    game.status = 'In Game';
    this.saveGameListToStorage();
  }

  finishGame(game: Game) {
    game.status = 'Completed';
    const player1 = this.playerService.getPlayerByName(game.player1);
    const player2 = this.playerService.getPlayerByName(game.player2);
    const player3 = this.playerService.getPlayerByName(game.player3);
    const player4 = this.playerService.getPlayerByName(game.player4);
    if (player1 && player2 && player3 && player4) {
      this.playerService.updatePlayerStatus(player1, 'Resting');
      this.playerService.updatePlayerStatus(player2, 'Resting');
      this.playerService.updatePlayerStatus(player3, 'Resting');
      this.playerService.updatePlayerStatus(player4, 'Resting');

      this.playerService.incrementGamesPlayed(player1);
      this.playerService.incrementGamesPlayed(player2);
      this.playerService.incrementGamesPlayed(player3);
      this.playerService.incrementGamesPlayed(player4);

      const restDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

      player1.restEndTime = new Date().getTime() + restDuration;
      player2.restEndTime = new Date().getTime() + restDuration;
      player3.restEndTime = new Date().getTime() + restDuration;
      player4.restEndTime = new Date().getTime() + restDuration;
      this.playerService.savePlayersToStorage();
      this.startRestCountdown();
    }
    this.saveGameListToStorage();
  }

  startRestCountdown() {
    setInterval(() => {
      this.playerService.players.forEach(player => {
        if (player.status === 'Resting' && player.restEndTime) {
          const currentTime = new Date().getTime();
          const remainingTime = Math.max(player.restEndTime - currentTime, 0);

          if (remainingTime > 0) {
            player.restTime = this.formatRestTime(remainingTime);
            //console.log("Player: " + player.name + " ===> " + player.restTime);
          } else {
            player.status = 'Available';
            player.restEndTime = 0;
            player.restTime = '';
          }
          this.playerService.savePlayersToStorage();
        }
      });
    }, 1000); // Update the countdown every second
  }

  formatRestTime(remainingTime: number): string {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `| ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public removeGamesToStorage(): void {
    localStorage.removeItem(this.storageKey);
    this.games = [];
    // Emit the event when the player data changes
    this.gamesDataChanged.emit();
  }
}
