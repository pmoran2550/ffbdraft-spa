import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ffb-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatButton, MatFormFieldModule, MatInputModule],
  templateUrl: './ffb-team-form.component.html',
  styleUrl: './ffb-team-form.component.css'
})
export class FfbTeamFormComponent implements OnInit {
  newTeamForm!: FormGroup;
  
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<FfbTeamFormComponent>) {
  }
  ngOnInit(): void {
    this.newTeamForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      manager: ['', Validators.required, Validators.maxLength(30)],
      email: ['', [Validators.required, Validators.email], Validators.maxLength(30)],
      thirdpartyid: ['', Validators.maxLength(30)],
      nickname: ['', Validators.maxLength(30)]
    });
  }

  get f() { return this.newTeamForm.controls; }

  onSubmit() {
    if (this.newTeamForm.valid) {
      console.log('Form Data:', this.newTeamForm.value); // Form values on submission
      this.dialogRef.close(this.newTeamForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
