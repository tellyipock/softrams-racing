import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Member } from '../app.interfaces';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.appService.getMembers()
      .subscribe(members => (this.members = members));
  }

  openMemberDetails(action: string, member?: Member): void {
    this.router.navigateByUrl('/member-details',
      { state: { 'action': action, 'member': member } });
  }
}
