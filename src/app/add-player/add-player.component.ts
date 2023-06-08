import { Component } from "@angular/core";
import { GameService } from "../service/game.service";
import { PlayerService } from "../service/player.service";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['add-player.component.css']
})
export class AddPlayerComponent {
  newPlayerName: string = '';

  constructor(public playerService: PlayerService,
              public gameService: GameService,
              private alertController: AlertController) {
  }

  addPlayer() {

    if (this.playerService.isPlayerAlreadyExist(this.newPlayerName.toUpperCase())){
      this.playerAlreadyExist("Player [" + this.newPlayerName + "] already exists.");
      return;
    }

    if (this.newPlayerName) {
      this.playerService.addPlayer(this.newPlayerName.toUpperCase());
      this.newPlayerName = '';
    }
  }

  async playerAlreadyExist(msg : string) {
    const alert = await this.alertController.create({
      header: 'Information',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
