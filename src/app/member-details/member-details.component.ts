import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Member, RouterParams } from '../app.interfaces';
import { GlobalConstants } from '../global-constants';

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


  displayForm(): void {
    console.log('displayForm, params: ', this.routerParams);
    this.memberForm = new FormGroup({
      firstName: new FormControl('', [ Validators.required ])
      , lastName: new FormControl('', [ Validators.required ])
      , jobTitle: new FormControl('', [ Validators.required ])
      , team: new FormControl('', [ Validators.required ])
      , status: new FormControl('', [ Validators.required ])
    });
    if(this.routerParams.action) {
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
            this.title = `Member Detail ${this.member.firstName} ${this.member.lastName}`;
            this.editMode = false;
            this.memberForm.patchValue(this.member);
            this.memberForm.disable();
          }
          else {
            this.alertMessage = 'No member found.';
          }
          break;
      }
      
    }
    else {
      this.alertMessage = 'No member found.';
      this.editMode = false;
      this.memberForm.disable();
    }
  }



  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.member = form.value;
    console.log('saved member: ', this.member);
    if(this.action === GlobalConstants.Action.Add) {
      this.appService.addMember(this.member)
      .subscribe((result) => {
        console.log(result);
        this.router.navigateByUrl('/members',
          { state: { 'action': this.action, 'result': result } });
      });
    }
  }
}
