import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FfbTeamFormComponent>,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: ffbteam | undefined) {
      this.isEditMode = !!this.data;
    }

  ngOnInit(): void {
    this.newTeamForm = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.maxLength(30)]],
      manager: [this.data?.manager ?? '', [Validators.required, Validators.maxLength(30)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(30)]],
      thirdpartyid: [this.data?.thirdpartyid ?? '', Validators.maxLength(35)],
      nickname: [this.data?.nickname ?? '', Validators.maxLength(30)]
    });
  }

  get f() { return this.newTeamForm.controls; } // Used for validation checks in the template

  onSubmit() {
    if (this.newTeamForm.valid) {
      this.isErrorResponse = false;

      if (this.isEditMode && this.data) {
        let updatedTeam: ffbteam = {
          ...this.data,
          ...this.newTeamForm.value
        };
        this.addTeamSubscription = this.teamService.putTeamUpdate(this.data.id, updatedTeam).subscribe({
          next: (resp) => {
            this.dialogRef.close(updatedTeam);
          },
          error: (error) => {
            this.postErrorMsg = 'Error updating team: ' + error.statusText;
            this.isErrorResponse = true;
            console.error('Error in put request: ', error);
          }
        });
      } else {
        let newTeam: ffbteam = this.newTeamForm.value;
        newTeam.id = '00000000-0000-0000-0000-000000000000';
        this.addTeamSubscription = this.teamService.addTeam(newTeam).subscribe({
          next: (resp) => {
            this.dialogRef.close(this.newTeamForm.value);
          },
          error: (error) => {
            this.postErrorMsg = 'Error adding team: ' + error.statusText;
            this.isErrorResponse = true;
            console.error('Error in post request: ', error);
          }
        });
      }
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
