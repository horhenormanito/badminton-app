import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonIcon } from '@ionic/angular';
import { Player } from '../models/player.model';
import {PlayerService } from '../service/player.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy {
  players: Player[];
  private playerDataChangedSubscription: Subscription | undefined;

  constructor(private playerService: PlayerService, private alertController: AlertController) {
    this.players = playerService.players;
  }

  ngOnInit(): void {
    // Subscribe to the playerDataChanged event
    this.playerDataChangedSubscription = this.playerService.playerDataChanged.subscribe(() => {
      // Refresh the player list table or perform any necessary actions
      this.refreshPlayerList();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the playerDataChanged event to avoid memory leaks
    if (this.playerDataChangedSubscription != undefined){
      this.playerDataChangedSubscription.unsubscribe();
    }
  }

  overrideRest(player: Player) {
    this.playerService.updatePlayerStatus(player, 'Available');
  }

  removePlayer(index: number): void {
    this.players.splice(index, 1);
    this.playerService.savePlayersToStorage();
  }

  getPlayerStatusClass(status: string): string {
    if (status === 'Available') {
      return 'available-status';
    } else if (status === 'In Game') {
      return 'in-game-status';
    } else if (status === 'Resting') {
      return 'resting-status';
    }
    return ''; // Default class
  }

  resetPlayers(): void {
    this.resetPlayersShowConfirm();
  }

  private refreshPlayerList(): void {
    this.players = this.playerService.players;
  }

  async resetPlayersShowConfirm() {
    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: '',
      message: 'Are you sure you want to reset the Player List table?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.playerService.removePlayersToStorage();
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
}
