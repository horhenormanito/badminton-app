import { Injectable, EventEmitter } from '@angular/core';
import { Game, GamePagination } from '../models/game.model';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private storageGameKey = 'game';
  private storageGamePaginationKey = 'gamePagination';
  games: Game[] = [];
  gamePagination : GamePagination = {
    currentPage:  1,
    itemsPerPage: 5,
    totalPages: 0
  };

  gamesDataChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(private playerService: PlayerService) {
    this.loadGameListFromStorage();
  }

  private loadGameListFromStorage(): void {
    const storedGameList = localStorage.getItem(this.storageGameKey);
    if (storedGameList) {
      this.games = JSON.parse(storedGameList);
      const storedGamePagination = localStorage.getItem(this.storageGamePaginationKey);
      this.gamePagination = storedGamePagination ? JSON.parse(storedGamePagination) : { currentPage: 1, itemsPerPage: 5, totalPages: 0 };
    }
  }

  private saveGameListToStorage(): void {
    localStorage.setItem(this.storageGameKey, JSON.stringify(this.games));
    localStorage.setItem(this.storageGamePaginationKey, JSON.stringify(this.gamePagination));
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

  removeGame(game: Game) {
    const player1 = this.playerService.getPlayerByName(game.player1);
    const player2 = this.playerService.getPlayerByName(game.player2);
    const player3 = this.playerService.getPlayerByName(game.player3);
    const player4 = this.playerService.getPlayerByName(game.player4);

    if (player1 && player2 && player3 && player4) {
      this.playerService.updatePlayerStatus(player1, 'Available');
      this.playerService.updatePlayerStatus(player2, 'Available');
      this.playerService.updatePlayerStatus(player3, 'Available');
      this.playerService.updatePlayerStatus(player4, 'Available');

      if (game.status === 'In Game'){
        player1.restEndTime = 0;
        player2.restEndTime = 0;
        player3.restEndTime = 0;
        player4.restEndTime = 0;
      }
      this.playerService.savePlayersToStorage();
    }

    // Remove the game object from the game list
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
      this.saveGameListToStorage();
    }
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
    localStorage.removeItem(this.storageGameKey);
    localStorage.removeItem(this.storageGamePaginationKey);
    this.games = [];
    // Emit the event when the player data changes
    this.gamesDataChanged.emit();
  }
}
