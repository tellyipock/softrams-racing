import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../shared/app.service';
import { Member, RouterParams } from '../shared/app.interfaces';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberForm: FormGroup;
  alertMessage: string;
  teams = [];
  member: Member;
  title: string;
  editMode: boolean = false;
  routerParams: RouterParams;
  loading: boolean = false;
  action: string = GlobalConstants.Action.Read;
  selectedTeam: string = '';

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    this.initiateForm();
    this.appService.getTeams()
      .subscribe((teams) => {
        if(teams) {
          this.alertMessage = '';
          this.teams = teams;
          this.routerParams = window.history.state;
          this.displayForm();
        }
        else {
          this.alertMessage = 'Error getting data. Refresh and try again.'
        }
        this.loading = false;
    });
  }

  ngOnChanges() {}

  initiateForm() {
    this.memberForm = new FormGroup({
      firstName: new FormControl('', [ Validators.required ])
      , lastName: new FormControl('', [ Validators.required ])
      , jobTitle: new FormControl('')
      , team: new FormControl('', [ Validators.required ])
      , status: new FormControl('', [ Validators.required ])
    });
  }

  displayForm(): void {
    this.editMode = false;

    if(!this.routerParams.action) {
      this.router.navigate(['/members']);
    }
    else {
      this.action = this.routerParams.action;
      switch(this.action) {
        case GlobalConstants.Action.Add:
          // Clear form and set it to editable
          this.title = 'Add a Member to Racing Team';
          this.editMode = true;
          this.memberForm.enable();
          this.memberForm.reset();  
          break;
        case GlobalConstants.Action.Edit:
          this.member = this.routerParams.member;
          if(this.member) {
            this.title = `Edit Member ${this.member.firstName} ${this.member.lastName}`;
            this.editMode = true;
            this.memberForm.enable();
            this.memberForm.patchValue(this.member);
            this.selectedTeam = this.member.team;
          }
          else {
            this.alertMessage = 'No member found.';
          }
          break;
        default:
          // Display member info on the page and set to read only
          this.member = this.routerParams.member;
          if(this.member) {
            this.title = `Member Detail: ${this.member.firstName} ${this.member.lastName}`;
            this.memberForm.patchValue(this.member);
            this.memberForm.disable();
          }
          else {
            this.alertMessage = 'No member found.';
          }
          break;
      }
    }
  }

  deleteMember(member: Member): void {
    if(!isNaN(member.id)) {
      const msg = `Are you sure you want to delete ${member.firstName} ${member.lastName}?`;
      if(confirm(msg)) {
        this.appService.deleteMember(member.id)
          .subscribe(result => {
            if(result.SUCCESS) {
              this.goHome(result, GlobalConstants.Action.Delete, member);
            }
            else {
              this.alertMessage = `Delete failed. Please try again.`;
            }
          })
      }
    }
  }

  editMember(member: Member): void {
    this.member = member;
    this.action = GlobalConstants.Action.Edit;
    this.title = `Edit Member ${member.firstName} ${member.lastName}`;
    this.editMode = true;
    this.memberForm.enable();
    this.selectedTeam = this.member.team;
  }

  onSubmit(form: FormGroup) {
    let memberData = form.value;
    if(this.action === GlobalConstants.Action.Add) {
      this.appService.addMember(memberData)
        .subscribe((result) => {
          this.goHome(result, this.action, memberData);
        });
    }
    else if(this.action === GlobalConstants.Action.Edit) {
      memberData.id = this.member.id;
      this.appService.editMember(memberData)
        .subscribe((result) => {
          this.goHome(result, this.action, memberData);
        });
    }
  }

  goHome(result, action, member) {
    let msg = '';
    if(result.SUCCESS) {
      if(action === GlobalConstants.Action.Add) {
        msg = `Member ${member.firstName} ${member.lastName} successfully added.`;
      }
      else if (action === GlobalConstants.Action.Edit) {
        msg = `Member ${member.firstName} ${member.lastName} successfully updated.`;
      }
      else if (action === GlobalConstants.Action.Delete) {
        msg = `Member ${member.firstName} ${member.lastName} successfully deleted.`;
      }
    }
    else {
      if(action === GlobalConstants.Action.Add) {
        msg = 'Add member failed. Please try again.';
      }
      else if (action === GlobalConstants.Action.Edit) {
        msg = 'Edit member failed. Please try again.';
      }
    }
    this.router.navigateByUrl('/members', { state: { message: msg } });
  }
}
