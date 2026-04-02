import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { finalize, map, Observable, Subscription, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { player } from '../../models/player';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { DraftService } from '../../services/draft.service';
import { draftpick } from '../../models/draftpick';
import { HttpErrorResponse } from '@angular/common/http';
import { DRAFT_ROUNDS, DRAFT_YEAR } from '../../constants';
import { DraftCardComponent } from '../../draft-card/draft-card/draft-card.component';
import { DraftOrderEditorComponent } from '../../draft-order-editor/draft-order-editor.component';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Custom pipe to filter draft picks by round
import { Pipe, PipeTransform } from '@angular/core';
import { PlayerCardComponent } from "../../player-card/player-card.component";
import { MatIcon } from "@angular/material/icon";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';

@Pipe({
  name: 'filterByRound',
  standalone: true,
  pure: true
})
export class FilterByRoundPipe implements PipeTransform {
  transform(picks: draftpick[], round: number): draftpick[] {
    if (!picks || round === null || round === undefined) {
      return [];
    }
    console.log('FilterByRoundPipe: filtering', picks.length, 'picks for round', round);
    const filtered = picks.filter(pick => pick.Round === round);
    console.log('FilterByRoundPipe: returning', filtered.length, 'picks');
    return filtered;
  }
}

@Component({
  selector: 'app-draft-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByRoundPipe, 
    DraftCardComponent, DraftOrderEditorComponent, 
    PlayerCardComponent, MatIcon, FaIconComponent, MatCheckbox, 
    MatLabel],
  templateUrl: './draft-page.component.html',
  styleUrl: './draft-page.component.css'
})
export class DraftPageComponent implements OnInit {
  playerData$: Observable<player[]> | undefined;
  private playerDataSubscription?: Subscription;
  playerData: player[] = [];
  filteredPlayerData: player[] = [];
  isLoading: boolean = true;
  errorMsg: string = "";
  draftRound: number = 1;
  draftPicksCollection: draftpick[] = [];
  isEditingOrder: boolean = false;
  activeTeams: any[] = [];
  isSaving: boolean = false; 
  faExclamationTriangle = faExclamationTriangle;
  showAvailableOnly: boolean = false;
  playerToFind: string = '';

  constructor(private playerService: PlayerService, 
    private teamService: TeamService, 
    private draftService: DraftService, 
    private cdr: ChangeDetectorRef) {

  }

  onRoundChange(): void {
    localStorage.setItem('draftRound', this.draftRound.toString());
    this.cdr.detectChanges();
  }

  startEditingOrder(): void {
    this.isEditingOrder = true;
  }

onSaveOrder(updatedPicks: draftpick[]): void {
  //this.draftPicksCollection = updatedPicks;
  this.isEditingOrder = false;

  const updatedPicksRound1 = updatedPicks.filter(pick => pick.Round === 1);

  // Build an array of update observables
  const updateRequests = this.activeTeams
    .map(team => {
      const updatedTeamPick = updatedPicksRound1.find(pick => pick.TeamID === team.id);
      if (!updatedTeamPick) return null;

      const updatedTeam = { ...team, draftOrder: updatedTeamPick.DraftOrder };
      return this.teamService.putTeamUpdate(team.id, updatedTeam);
    })
    .filter(req => req !== null);

  if (updateRequests.length === 0) return;

  this.isSaving = true; // show a spinner/disable buttons in the UI

  forkJoin(updateRequests).pipe(
    finalize(() => {
      this.isSaving = false; // always runs, even on error
      this.cdr.detectChanges();
    })
  ).subscribe({
    next: () => {
      // All updates succeeded — now safe to update local state
      this.activeTeams.forEach(team => {
        const updatedTeamPick = updatedPicksRound1.find(pick => pick.TeamID === team.id);
        if (updatedTeamPick) team.draftOrder = updatedTeamPick.DraftOrder;
      });
      this.activeTeams = [...this.activeTeams];
      this.draftPicksCollection = this.createDraftPicksCollection(this.activeTeams, updatedPicks);
      console.log('All draft orders updated successfully');
    },
    error: err => {
      console.error('One or more updates failed:', err);
      // Optionally revert UI or show an error message
      this.errorMsg = 'Failed to save draft order. Please try again.';
    }
  });
}

  onCancelEdit(): void {
    this.isEditingOrder = false;
  }

  createDraftPicksCollection(teams: any[], draftPicks: any[]): draftpick[] {
        this.draftPicksCollection = [];
        
        for (let round = 1; round <= DRAFT_ROUNDS; round++) {
          for (let i = 0; i < this.activeTeams.length; i++) {
            const team = this.activeTeams[i];
            const draftPick: draftpick = {
              id: '',
              TeamID: team.id,
              TeamName: team.name,
              TeamManager: team.manager,
              PlayerID: '',
              PlayerName: '',
              PlayerPosition: '',
              PlayerNFLTeam: '',
              Round: round,
              DraftOrder: team.draftOrder, 
              Year: DRAFT_YEAR
            };
            
            // Fill in PlayerID and PlayerName from draftPicks results
            const matchingPick = draftPicks.find((pick: any) => 
              pick.ffbteamId === team.id && pick.draftNumber === round
            );
            
            if (matchingPick) {
              draftPick.id = matchingPick.id || '';
              draftPick.PlayerID = matchingPick.playerId || '';
              draftPick.PlayerName = matchingPick.playerName || '';
              draftPick.PlayerPosition = matchingPick.playerPosition || '';
              draftPick.PlayerNFLTeam = matchingPick.playerNFLTeam || '';
            }
            
            this.draftPicksCollection.push(draftPick);
          }
        }
        
        // Sort draftPicksCollection by DraftOrder
        this.draftPicksCollection.sort((a, b) => a.DraftOrder - b.DraftOrder);
        
        console.log('Both requests are complete');
        console.log('Draft picks collection created with', this.draftPicksCollection.length, 'entries');

        return this.draftPicksCollection;
    }

  ngOnInit(): void {
    this.getPlayerData(DRAFT_YEAR);

    // Load the previously selected round from localStorage
    const storedRound = localStorage.getItem('draftRound');
    if (storedRound) {
      this.draftRound = parseInt(storedRound, 10);
    }

    forkJoin([
      this.teamService.getTeams(),
      this.draftService.getDraftPicks()
    ]).subscribe({
      next: ([teams, draftPicks]) => {
        console.log('Teams loaded:', teams);
        console.log('Draft picks loaded:', draftPicks);
        
        // Filter out the "Undrafted" team
        this.activeTeams = teams.filter((team: any) => team.name !== 'Undrafted');
        this.draftPicksCollection = this.createDraftPicksCollection(this.activeTeams, draftPicks);
        
      },
      error: err => {
        console.error('Error loading data:', err);
      }
    });
  }

  getPlayerData(year: number) {
    this.playerData$ = this.playerService.getPlayersByYear(year).pipe(
      map(players => players.map((player: any) => ({
        ...player,
      }))),
      finalize(() => {
        this.sort();
        this.filter();    
      })
    );

    const subscription = this.playerData$.subscribe({
      next: processedPlayers => {
        console.log('Player data loaded');
        this.playerData = processedPlayers;
        this.filteredPlayerData = processedPlayers;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading player data:', err);
        this.filteredPlayerData = [];
        this.isLoading = false;
        if (err instanceof HttpErrorResponse) {
          this.errorMsg = err.message;
        } else {
          this.errorMsg = "Unknown error";
        }
      }
    });
  
    // Store subscription if needed for cleanup
    this.playerDataSubscription?.unsubscribe(); // Cleanup previous
    this.playerDataSubscription = subscription;
  }  

    sort(){
    if (this.playerData.length > 0)
    {
      this.playerData.sort((a, b) => a.rank - b.rank);
    }
  }

  filter() {
    if (this.playerData.length > 0) {
      this.filteredPlayerData = [];
      this.playerData.forEach(player => {
        if ((!this.showAvailableOnly || 
          ('Available' == player.ffbTeamManager)) && 
          player.name.toLocaleLowerCase().includes(this.playerToFind.toLowerCase())) 
        {
          this.filteredPlayerData.push(player);
        }
      })
    }
  }

  availableFilterChanged(event: MatCheckboxChange) {
    if (event.checked) {
      this.showAvailableOnly = true;
    }
    else {
      this.showAvailableOnly = false;
    }

    this.filter();
  }

  onPlayerSearch(value: string) {
    this.filter();
  }
  
}
