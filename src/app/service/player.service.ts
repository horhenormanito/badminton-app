import { Injectable, EventEmitter  } from "@angular/core";
import { Player } from "../models/player.model";
import { PlayerSummary } from "../models/player.summary.model";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private storageKey = 'players';
  players: Player[] = [];
  playerDataChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {
    this.loadPlayersFromStorage();
  }

  private loadPlayersFromStorage(): void {
    const storedPlayers = localStorage.getItem(this.storageKey);
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
    }
  }

  public savePlayersToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.players));
    // Emit the event when the player data changes
    this.playerDataChanged.emit();
  }

  public removePlayersToStorage(): void {
    localStorage.removeItem(this.storageKey);
    this.players = [];
    // Emit the event when the player data changes
    this.playerDataChanged.emit();
  }

  addPlayer(name: string) {
    const player: Player = {
      name: name,
      gamesPlayed: 0,
      status: 'Available',
      isRestStarted: false,
      restEndTime: 0,
      restTime: ''
    };
    this.players.push(player);
    this.savePlayersToStorage();
  }

  updatePlayerStatus(player: Player, status: string) {
    player.status = status;
    this.savePlayersToStorage();
  }

  incrementGamesPlayed(player: Player){
    player.gamesPlayed++;
    this.savePlayersToStorage();
  }

  setRestStarted(player: Player, isRestStarted: boolean){
    player.isRestStarted = isRestStarted;
    this.savePlayersToStorage();
  }

  getPlayerByName(name: string) {
    return this.players.find(player => player.name === name);
  }

  getAvailablePlayers(): Player[] {
    return this.players.filter(player => player.status === 'Available').sort(() => Math.random() - 0.5);
  }

  resetPlayerStatus() {
    this.players.forEach(player => {
      player.status = 'Available';
    });
    this.savePlayersToStorage();
  }

  shufflePlayers() {
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
  }

  setPlayersInRest() {
    const restDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.players.forEach(player => {
      player.status = 'Resting';
      player.restEndTime = new Date().getTime() + restDuration;
      this.savePlayersToStorage();
    });
  }

  setPlayersAvailable() {
    setTimeout(() => {
      this.players.forEach(player => {
        player.status = 'Available';
        player.restEndTime = 0; // Reset restEndTime to null
        this.savePlayersToStorage();
      });
    }, 300000); // 5 minutes in milliseconds
  }

  sortPlayersByGamesPlayed(players: Player[]): Player[] {
    return players.sort((a, b) => a.gamesPlayed - b.gamesPlayed);
  }

  isPlayerAlreadyExist(newPlayer: string) : boolean {
    return this.players.some(player => player.name === newPlayer);
  }
}

