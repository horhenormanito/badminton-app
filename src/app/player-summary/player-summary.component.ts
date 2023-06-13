import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { PlayerSummary } from '../models/player.summary.model';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.css']
})
export class PlayerSummaryComponent implements OnInit, OnDestroy {
  players: Player[];
  playerSummary: PlayerSummary = {
    playersTotal: 0,
    playersAvailable: 0,
    playersInGame: 0,
    playersAtRest: 0,
    playersOnHold: 0
  }; //

  private playerDataChangedSubscription: Subscription | undefined;

  constructor(private playerService: PlayerService) {
    this.players = playerService.players;
  }

  ngOnInit(): void {
    // Subscribe to the playerDataChanged event
    this.playerDataChangedSubscription = this.playerService.playerDataChanged.subscribe(() => {
      // Refresh the player list table or perform any necessary actions
      this.getPlayersSummary();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the playerDataChanged event to avoid memory leaks
    if (this.playerDataChangedSubscription != undefined){
      this.playerDataChangedSubscription.unsubscribe();
    }
  }

  public getPlayersSummary() : string {
    this.players = this.playerService.players;
    this.playerSummary.playersTotal = this.players.length;
    this.playerSummary.playersAvailable = this.players.filter(p => p.status === 'Available').length;
    this.playerSummary.playersInGame = this.players.filter(p => p.status === 'In Game').length;
    this.playerSummary.playersAtRest = this.players.filter(p => p.status === 'Resting').length;
    this.playerSummary.playersOnHold = this.players.filter(p => p.status === 'On Hold').length;

    const totalPlayers = this.players.length;
    const availablePlayers = this.players.filter(player => player.status === 'Available').length;
    const summary = `Total Players: ${totalPlayers}, Available Players: ${availablePlayers}, In Game Players: ${this.playerSummary.playersInGame}`;
    return summary;
  }
}
