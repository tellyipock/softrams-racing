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
    this.appService.getMembers().subscribe(members => (this.members = members));
  }

  goToAddMemberForm(): void {
    this.router.navigate(['member-details']);
  }

  openMemberPage(member: Member): void {
    console.log('openMemberPage, member', member);
    this.router.navigateByUrl('/member-details'
      , { state: { 'member': member } });
  }

  editMemberByID(memberID: number): void {
    if(memberID) {
      this.router.navigate(['member-details', { id: memberID }]);
    }
  }

  deleteMemberById(id: number) {}
}
