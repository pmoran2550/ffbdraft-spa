import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService } from '../services/team.service';
import { ffbteam } from '../models/ffbteam';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ffb-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatButton, MatFormFieldModule, MatInputModule],
  templateUrl: './ffb-team-form.component.html',
  styleUrl: './ffb-team-form.component.css'
})
export class FfbTeamFormComponent implements OnInit, OnDestroy {
  newTeamForm!: FormGroup;
  apiResponse$: Observable<any> | undefined;
  private addTeamSubscription?: Subscription;
  postErrorMsg: string = '';
  isErrorResponse: boolean = false;
  
  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<FfbTeamFormComponent>, 
    private teamService: TeamService) { }

  ngOnInit(): void {
    this.newTeamForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      manager: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      thirdpartyid: ['', Validators.maxLength(35)],
      nickname: ['', Validators.maxLength(30)]
    });
  }

  get f() { return this.newTeamForm.controls; } // Used for validation checks in the template

  onSubmit() {
    if (this.newTeamForm.valid) {
      this.isErrorResponse = false;
      let newTeam: ffbteam = this.newTeamForm.value;
      newTeam.id = '00000000-0000-0000-0000-000000000000';
      this.addTeamSubscription = this.teamService.addTeam(newTeam).subscribe({
        next: (resp) => { console.log("addTeam response: ", resp);
        this.dialogRef.close(this.newTeamForm.value);
        },
        error: (error) => {
          this.postErrorMsg = 'Error adding team: ' + error.statusText;
          this.isErrorResponse = true;
          console.error('Error in post request: ', error);
        }
      });
      console.log('Form Data:', this.newTeamForm.value); // Form values on submission
    } else {
      console.log('Form is invalid.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.addTeamSubscription?.unsubscribe();
  }
}
