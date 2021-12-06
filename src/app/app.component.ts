import { Component, OnInit } from '@angular/core';
import { AppService } from './shared/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    if (!this.appService.username) {
      this.appService.setUsername(localStorage.getItem('username'));
    }
  }
}
