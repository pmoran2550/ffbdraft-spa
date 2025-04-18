import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../services/team.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatRadioModule} from '@angular/material/radio'
import { Observable } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pick-ffb-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, MatRadioModule, AsyncPipe, MatButton],
  templateUrl: './pick-ffb-team-form.component.html',
  styleUrl: './pick-ffb-team-form.component.css'
})
export class PickFfbTeamFormComponent {

  teamPickForm: FormGroup;
  teamList: any = [];
  teamData$: Observable<ffbteam[]> | undefined;

  constructor(private fb: FormBuilder, 
    public dialogRef: MatDialogRef<PickFfbTeamFormComponent>, 
    private teamservice: TeamService) {
      this.teamPickForm = this.fb.group({
        teams: ['']
      });

      this.getTeamData();
  }

  getTeamData() {
    this.teamData$ = this.teamservice.getTeams();
  }

  submit() {
    console.log(this.teamPickForm.value);
    this.dialogRef.close(this.teamPickForm.value);
  }
    
  closeModal(): void {
    this.dialogRef.close(undefined);
  }

}
