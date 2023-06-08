
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { GameListComponent } from './game-list/game-list.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerSummaryComponent } from './player-summary/player-summary.component';
import { NgModule } from '@angular/core';
import { PlayerService } from './service/player.service';
import { AppRoutingModule } from './app.routing.module';


@NgModule({
  declarations: [AppComponent, AddPlayerComponent, GameListComponent, PlayerListComponent, PlayerSummaryComponent],
  imports: [BrowserModule, FormsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [PlayerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
