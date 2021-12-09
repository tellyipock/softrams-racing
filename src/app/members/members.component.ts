import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../shared/app.service';
import { Member } from '../shared/app.interfaces';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];
  alertMessage: string | undefined;
  showAlert = false;

  constructor(public appService: AppService,
    private router: Router) {}

  ngOnInit(): void {
    const state = window.history.state;
    if(state.message) {
      this.alertMessage = state.message;
    }
    this.appService.getMembers()
      .subscribe(members => (this.members = members));
  }

  openMemberDetails(action: string, member?: Member): void {
    this.router.navigateByUrl('/member-details',
      { state: { 'action': action, 'member': member } });
  }

  deleteMember(member: Member): void {
    const msg = `Are you sure you want to delete ${member.firstName} ${member.lastName}?`;
    if(confirm(msg)) {
      this.appService.deleteMember(member.id)
      .subscribe(result => {
        if(result.SUCCESS) {
          this.alertMessage = `Member ${member.firstName} ${member.lastName} deleted successfully.`;
          this.getMembers();
        }
      });
    }
  }

  getMembers(): void {
    this.appService.getMembers()
      .subscribe(members => (this.members = members));
  }
}
