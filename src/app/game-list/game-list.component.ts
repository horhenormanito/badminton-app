import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {Game, GamePagination} from '../models/game.model';
import {GameService } from '../service/game.service';
import { PlayerService } from '../service/player.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[];
  gamePagination : GamePagination;

  private gamesDataChangedSubscription: Subscription | undefined;

  constructor(public gameService: GameService, public playerService: PlayerService, private alertController: AlertController) {
    this.games = gameService.games;
    this.gamePagination = gameService.gamePagination;
  }

  ngOnInit(): void {
    // Subscribe to the playerDataChanged event
    this.gamesDataChangedSubscription = this.gameService.gamesDataChanged.subscribe(() => {
      // Refresh the player list table or perform any necessary actions
      this.refreshGamesList();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the playerDataChanged event to avoid memory leaks
    if (this.gamesDataChangedSubscription != undefined){
      this.gamesDataChangedSubscription.unsubscribe();
    }
  }

  private refreshGamesList(): void {
    this.games = this.gameService.games;
  }

  createGame() {
    const availablePlayers = this.playerService.getAvailablePlayers();
    const notStartedGAmes = this.games.filter(game => game.status === 'Not Started');

    if (notStartedGAmes.length > 0){
      this.unableToCreateGame('Start all pending games before creating new game.');
      return;
    }

    if (availablePlayers.length >= 4) {
      this.gameService.createGame();
      // Call updateTotalPages to recalculate the total pages
      this.updateTotalPages();
    } else {
      this.unableToCreateGame('A minimum of four available players is required to create a new game.')
    }
  }

  startGame(game: Game) {
    this.gameService.startGame(game);
    const player1 = this.playerService.getPlayerByName(game.player1);
    const player2 = this.playerService.getPlayerByName(game.player2);
    const player3 = this.playerService.getPlayerByName(game.player3);
    const player4 = this.playerService.getPlayerByName(game.player4);
    if (player1 && player2 && player3 && player4) {
      this.playerService.updatePlayerStatus(player1, 'In Game');
      this.playerService.updatePlayerStatus(player2, 'In Game');
      this.playerService.updatePlayerStatus(player3, 'In Game');
      this.playerService.updatePlayerStatus(player4, 'In Game');
    }
  }

  finishGame(game: Game) {
    this.gameService.finishGame(game);
  }

  removeGame(game: Game) {
    this.removeGameShowConfirm(game);
  }

  getGameStatusClass(status: string): string {
    if (status === 'In Game') {
      return 'in-game-status';
    } else if (status === 'Completed') {
      return 'completed-status';
    }
    return ''; // Default class
  }

  resetGames(): void {
    this.resetGamesShowConfirm();
  }

  async unableToCreateGame(msg : string) {
    const alert = await this.alertController.create({
      header: 'Information',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async resetGamesShowConfirm() {
    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: '',
      message: 'Are you sure you want to reset the Game List table?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.gameService.removeGamesToStorage();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            // no action
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async removeGameShowConfirm(game: Game) {
    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: '',
      message: 'Are you sure you want to remove the game from the game table?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.gameService.removeGame(game);
            // Call updateTotalPages to recalculate the total pages
            this.updateTotalPages();
          }
        },
        {
          text: 'No',
          handler: () => {
            // no action
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  /**
   * Pagination
   */
  updateTotalPages() {
    this.gamePagination.totalPages = Math.ceil(this.games.length / this.gamePagination.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.gamePagination.totalPages) {
      this.gamePagination.currentPage = page;
    }
  }

  getPaginatedGames(): Game[] {
    const revertedGames = this.games.reverse();
    const startIndex = (this.gamePagination.currentPage - 1) * this.gamePagination.itemsPerPage;
    const endIndex = startIndex + this.gamePagination.itemsPerPage;
    return revertedGames.slice(startIndex, endIndex);
  }

}
