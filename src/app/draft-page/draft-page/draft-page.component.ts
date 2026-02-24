import { Component, Inject, OnInit } from '@angular/core';
import { finalize, map, Observable, Subscription, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { player } from '../../models/player';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { DraftService } from '../../services/draft.service';
import { draftpick } from '../../models/draftpick';
import { HttpErrorResponse } from '@angular/common/http';
import { DRAFT_ROUNDS, DRAFT_YEAR } from '../../constants';

// Custom pipe to filter draft picks by round
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByRound',
  standalone: true
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
  imports: [CommonModule, FilterByRoundPipe],
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

  constructor(private playerService: PlayerService, private teamService: TeamService, private draftService: DraftService) {}

  ngOnInit(): void {
    forkJoin([
      this.teamService.getTeams(),
      this.draftService.getDraftPicks()
    ]).subscribe({
      next: ([teams, draftPicks]) => {
        console.log('Teams loaded:', teams);
        console.log('Draft picks loaded:', draftPicks);
        
        // Filter out the "Undrafted" team
        const activeTeams = teams.filter((team: any) => team.name !== 'Undrafted');
        
        this.draftPicksCollection = [];
        
        for (let round = 1; round <= DRAFT_ROUNDS; round++) {
          for (let i = 0; i < activeTeams.length; i++) {
            const team = activeTeams[i];
            const draftPick: draftpick = {
              DraftOrder: team.draftOrder, 
              TeamID: team.id,
              TeamName: team.name,
              TeamManager: team.manager,
              PlayerID: '',
              PlayerName: '',
              Round: round,
              Year: DRAFT_YEAR
            };
            
            // Fill in PlayerID and PlayerName from draftPicks results
            const matchingPick = draftPicks.find((pick: any) => 
              pick.FFBTeamId === team.TeamID && pick.DraftNumber === round
            );
            
            if (matchingPick) {
              draftPick.PlayerID = matchingPick.PlayerID || '';
              draftPick.PlayerName = matchingPick.PlayerName || '';
            }
            
            this.draftPicksCollection.push(draftPick);
          }
        }
        
        // Sort draftPicksCollection by DraftOrder
        this.draftPicksCollection.sort((a, b) => a.DraftOrder - b.DraftOrder);
        
        console.log('Both requests are complete');
        console.log('Draft picks collection created with', this.draftPicksCollection.length, 'entries');
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
      })))
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
}
