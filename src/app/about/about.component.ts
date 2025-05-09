import { Component, OnInit, isDevMode } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  version$: Observable<any> | undefined;
  MajorVersion: string = '0';
  MinorVersion: string = '0';
  PatchVersion: string = '0';
  BuildVersion: string = '0';
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getVersion().subscribe(data => {
      this.MajorVersion = data.Major;
      this.MinorVersion = data.Minor;
      this.PatchVersion = data.Patch;
      if (isDevMode()) {
        this.BuildVersion = '0';
      } else {
        this.BuildVersion = data.Build;
      }
    });
  }

  getVersion(): Observable<any> {
    let reqUrl = `../assets/version.json`;
    return this.apiService.getRequest(reqUrl, undefined);
  }
  
}
