import { Component, OnInit, OnDestroy, HostListener, ElementRef  } from '@angular/core';
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
  isScreenSmall: boolean = false;
  private playerDataChangedSubscription: Subscription | undefined;

  constructor(private playerService: PlayerService, private alertController: AlertController, private elementRef: ElementRef) {
    this.players = playerService.players;
  }

  ngOnInit(): void {
    this.checkScreenSize();
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const componentWidth = this.elementRef.nativeElement.offsetWidth;
    this.isScreenSmall = componentWidth < 500; // Example threshold for small screen size
  }

  removePlayer(index: number): void {
    this.removePlayerShowConfirm(index);
  }

  onholdPlayer(player: Player): void {
    this.onholdPlayerShowConfirm(player);
  }

  availPlayer(player: Player): void {
    this.playerService.updatePlayerStatus(player, 'Available');
  }

  overrideRest(player: Player) {
    this.playerService.updatePlayerStatus(player, 'Available');
  }

  getPlayerStatusClass(status: string): string {
    if (status === 'Available') {
      return 'available-status';
    } else if (status === 'In Game') {
      return 'in-game-status';
    } else if (status === 'Resting') {
      return 'resting-status';
    } else if (status === 'On Hold') {
      return 'onhold-status';
    }
    return ''; // Default class
  }

  resetPlayers(): void {
    this.resetPlayersShowConfirm();
  }

  private refreshPlayerList(): void {
    this.players = this.playerService.players;
  }

  async onholdPlayerShowConfirm(player : Player) {

    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: '',
      message: 'Are you sure you want to on hold player ' + player.name +'?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.playerService.updatePlayerStatus(player, 'On Hold');
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

  async removePlayerShowConfirm(index : number) {
    const playerName = this.players.at(index)?.name;

    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: '',
      message: 'Are you sure you want to delete player ' + playerName +'?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.players.splice(index, 1);
            this.playerService.savePlayersToStorage();
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
