import { Component, Inject, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../services/team.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatRadioModule} from '@angular/material/radio'
import { Observable } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pick-ffb-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, MatRadioModule, AsyncPipe, MatButton, NgIf],
  templateUrl: './pick-ffb-team-form.component.html',
  styleUrl: './pick-ffb-team-form.component.css'
})
export class PickFfbTeamFormComponent {

  teamPickForm: FormGroup;
  teamList: any = [];
  teamData$: Observable<ffbteam[]> | undefined;
  showAll: boolean = false;
  allTeam: ffbteam = {
    id: '0',
    name: 'All',
    manager: 'All',
    email: ' ',
    thirdpartyid: ' ',
    nickname: ' '
  }

  constructor(private fb: FormBuilder, 
    public dialogRef: MatDialogRef<PickFfbTeamFormComponent>, 
    private teamservice: TeamService, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.teamPickForm = this.fb.group({
        teams: ['']
      });

      this.getTeamData();
      this.showAll = data;
  }

  getTeamData() {
    this.teamData$ = this.teamservice.getTeams();
  }

  submit() {
    let teamVal: string = this.teamPickForm.value;
    if (this.teamPickForm.valid == undefined)
      teamVal = 'All';
    this.dialogRef.close(teamVal);
  }
    
  closeModal(): void {
    this.dialogRef.close();
  }

}
