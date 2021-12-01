import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { AppService } from '../app.service';
import { Member } from '../app.interfaces';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  member: Member | undefined;
  editMode: boolean = false;
  routerParams: { member?: Member } = {};
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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
          this.alertMessage = 'Error getting teams list. Refresh and try again.'
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
    if(this.routerParams.member) {
      // Display member info on the page and set to read only
      this.member = this.routerParams.member;
      this.memberForm.patchValue(this.member);
      this.memberForm.disable();
    }
    else {
      console.log('No member found in router params');
      this.editMode = true;
      this.memberForm.enable();
    }
    
  }



  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
  }
}
