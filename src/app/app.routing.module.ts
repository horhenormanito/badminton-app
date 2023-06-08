import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerListComponent } from './player-list/player-list.component';
import { AddPlayerComponent } from './add-player/add-player.component';

const routes: Routes = [
  { path: 'player-list', component: PlayerListComponent },
  { path: 'add-player', component: AddPlayerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
