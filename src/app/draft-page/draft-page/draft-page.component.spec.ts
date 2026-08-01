import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DraftPageComponent } from './draft-page.component';
import { DraftService } from '../../services/draft.service';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';

describe('DraftPageComponent', () => {
  let component: DraftPageComponent;
  let fixture: ComponentFixture<DraftPageComponent>;
  let draftService: jasmine.SpyObj<DraftService>;

  beforeEach(async () => {
    draftService = jasmine.createSpyObj('DraftService', ['addDraftPick', 'getDraftPicks']);
    draftService.addDraftPick.and.returnValue(of({}));
    draftService.getDraftPicks.and.returnValue(of([]));

    const playerService = jasmine.createSpyObj('PlayerService', ['getPlayersByYear']);
    playerService.getPlayersByYear.and.returnValue(of([]));

    const teamService = jasmine.createSpyObj('TeamService', ['getTeams']);
    teamService.getTeams.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DraftPageComponent],
      providers: [
        { provide: DraftService, useValue: draftService },
        { provide: PlayerService, useValue: playerService },
        { provide: TeamService, useValue: teamService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the drafted player from the filtered lists after saving', () => {
    const draftedPlayer = {
      id: 1,
      name: 'QB Player',
      rank: 1,
      position: 'QB',
      nflTeam: 'BUF',
      ffbTeamManager: 'Available'
    } as any;

    component.playerData = [draftedPlayer];
    component.filteredPlayerData = [draftedPlayer];
    component.selectedPlayer = draftedPlayer;
    component.selectedDraftPick = {
      TeamID: 2,
      TeamManager: 'Manager',
      TeamName: 'Team A'
    } as any;

    component.onDraftPlayer();

    expect(component.playerData).not.toContain(draftedPlayer);
    expect(component.filteredPlayerData).not.toContain(draftedPlayer);
  });

  it('should group picks into one roster per team, in draft order', () => {
    component.draftPicksCollection = [
      { TeamID: 'b', TeamName: 'Team B', TeamManager: 'Bob', Round: 2, DraftOrder: 2, PlayerName: '' },
      { TeamID: 'a', TeamName: 'Team A', TeamManager: 'Ann', Round: 2, DraftOrder: 1, PlayerName: 'Player A2' },
      { TeamID: 'b', TeamName: 'Team B', TeamManager: 'Bob', Round: 1, DraftOrder: 2, PlayerName: 'Player B1' },
      { TeamID: 'a', TeamName: 'Team A', TeamManager: 'Ann', Round: 1, DraftOrder: 1, PlayerName: 'Player A1' }
    ] as any;

    const rosters = component.buildTeamRosters();

    expect(rosters.map(roster => roster.TeamID)).toEqual(['a', 'b']);
    expect(rosters[0].Picks.map(pick => pick.Round)).toEqual([1, 2]);
    expect(rosters[1].Picks.map(pick => pick.PlayerName)).toEqual(['Player B1', '']);
  });

  it('should count made picks when preparing the printout', () => {
    component.draftPicksCollection = [
      { TeamID: 'a', TeamName: 'Team A', TeamManager: 'Ann', Round: 1, DraftOrder: 1, PlayerName: 'Player A1' },
      { TeamID: 'a', TeamName: 'Team A', TeamManager: 'Ann', Round: 2, DraftOrder: 1, PlayerName: '' }
    ] as any;
    spyOn(window, 'print');

    component.onPrintDraft();

    expect(component.printPicksMade).toBe(1);
    expect(component.printTotalPicks).toBe(2);
    expect(component.printRosters.length).toBe(1);
    expect(window.print).toHaveBeenCalled();
  });

  it('should highlight the available player with the lowest rank', () => {
    component.playerData = [
      { id: '1', name: 'Best Available', rank: 1, ffbTeamManager: 'Available' },
      { id: '2', name: 'Already Drafted', rank: 2, ffbTeamManager: 'Team A' },
      { id: '3', name: 'Second Best Available', rank: 3, ffbTeamManager: 'Available' }
    ] as any;

    component.selectNextAvailablePlayer();

    expect(component.selectedPlayer?.id).toBe('1');
  });

  it('should highlight the next pick in draft order without a player', () => {
    component.draftPicksCollection = [
      { TeamID: 'a', Round: 1, DraftOrder: 1, PlayerID: 'p1', PlayerName: 'Player A1' },
      { TeamID: 'b', Round: 1, DraftOrder: 2, PlayerID: '', PlayerName: '' },
      { TeamID: 'a', Round: 2, DraftOrder: 1, PlayerID: '', PlayerName: '' }
    ] as any;

    component.selectNextDraftPick();

    expect(component.selectedDraftPick?.TeamID).toBe('b');
    expect(component.selectedDraftPick?.Round).toBe(1);
  });

  it('should reverse draft order on even rounds (snake draft)', () => {
    component.draftPicksCollection = [
      { TeamID: 'a', Round: 1, DraftOrder: 1, PlayerID: 'p1', PlayerName: 'Player A1' },
      { TeamID: 'b', Round: 1, DraftOrder: 2, PlayerID: 'p2', PlayerName: 'Player B1' },
      { TeamID: 'c', Round: 1, DraftOrder: 3, PlayerID: 'p3', PlayerName: 'Player C1' },
      { TeamID: 'c', Round: 2, DraftOrder: 3, PlayerID: '', PlayerName: '' },
      { TeamID: 'b', Round: 2, DraftOrder: 2, PlayerID: '', PlayerName: '' },
      { TeamID: 'a', Round: 2, DraftOrder: 1, PlayerID: '', PlayerName: '' }
    ] as any;

    // Round 1 complete; round 2 (even) should start with the highest draft position
    component.selectNextDraftPick();
    expect(component.selectedDraftPick?.TeamID).toBe('c');

    // Once the highest position picks, the next pick in the even round is the previous position
    component.draftPicksCollection[3].PlayerID = 'p4';
    component.draftPicksCollection[3].PlayerName = 'Player C2';
    component.selectNextDraftPick();
    expect(component.selectedDraftPick?.TeamID).toBe('b');
  });

  it('should re-highlight the next best-available player and next open pick after a pick is made', () => {
    const draftedPlayer = { id: '1', name: 'Drafted', rank: 1, ffbTeamManager: 'Available' } as any;
    const nextBestPlayer = { id: '2', name: 'Next Best', rank: 2, ffbTeamManager: 'Available' } as any;

    component.playerData = [draftedPlayer, nextBestPlayer];
    component.filteredPlayerData = [draftedPlayer, nextBestPlayer];
    component.selectedPlayer = draftedPlayer;
    component.selectedDraftPick = { TeamID: 'a', TeamManager: 'Manager', TeamName: 'Team A', Round: 1, DraftOrder: 1 } as any;
    component.draftPicksCollection = [
      component.selectedDraftPick,
      { TeamID: 'b', TeamManager: 'Manager B', TeamName: 'Team B', Round: 1, DraftOrder: 2, PlayerID: '', PlayerName: '' }
    ] as any;

    component.onDraftPlayer();

    expect(component.selectedPlayer?.id).toBe('2');
    expect(component.selectedDraftPick?.TeamID).toBe('b');
  });
});
