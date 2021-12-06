import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MemberDetailsComponent } from './member-details.component';
import { MessageComponent } from '../shared/message/message.component';
import { AppService } from '../shared/app.service';

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };
  let serviceSpy: jasmine.SpyObj<AppService>;

  const mockMember = {
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Driver",
    "team": "Formula 1 - Car 77",
    "status": "Active"
  };

  const mockTeams = [
    {
      "id": 1,
      "teamName": "Formula 1 - Car 77"
    },
    {
      "id": 5,
      "teamName": "Deutsche Tourenwagen Masters - Car 117"
    }
  ];

  const disabledForm = { firstName: '', lastName: '', jobTitle: '', team: '', status: '' };

  const mockForm = new FormGroup({
    firstName: new FormControl('', [ Validators.required ])
    , lastName: new FormControl('', [ Validators.required ])
    , jobTitle: new FormControl('')
    , team: new FormControl('', [ Validators.required ])
    , status: new FormControl('', [ Validators.required ])
  });
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDetailsComponent, MessageComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'members', component: MemberDetailsComponent }
        ])
      ],
      providers: [
        Location,
        { 
          provide: AppService,
          useValue: jasmine.createSpyObj('AppService', ['getTeams'])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      serviceSpy = TestBed.get(AppService);
      serviceSpy.getTeams.and.returnValue(of(mockTeams));
      window.history.pushState({ action: 'ADD' }, '', '');
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('TEST ngOnInit', async(() => {
      component.ngOnInit();
      console.log(component.memberForm.value);
      expect(component.memberForm).toBeDefined();
    }));
  
    it('should call appService.getTeams and update values if success', async(() => {
      fixture.whenStable().then(() => {
        expect(component.teams).toEqual(mockTeams);
        expect(component.alertMessage).toEqual('');
        expect(component.routerParams).toEqual({ action: 'ADD' });
      });
    }));

    /* Testing template */
    it('CHECK the initial values for memberForm', () => {
      component.memberForm = mockForm;
      const initialForm = {
        firstName: '',
        lastName: '',
        jobTitle: '',
        team: '',
        status: ''
      };
      expect(component.memberForm.value).toEqual(initialForm);
    });

    it('TEST the form group element count', () => {
      component.memberForm = mockForm;
      component.loading = false;
      
      component.memberForm.patchValue(mockMember);
      const memberForm = document.getElementById('#memberForm');
      const inputs = memberForm.querySelectorAll('input');
      expect(inputs.length).toEqual(5);
    });

    it('Back to Member List button should exist', () => {
      let btn = fixture.debugElement.query(By.css('#back'));
      const btnText = btn.nativeElement.textContent;
      expect(btnText.trim()).toEqual('Back to Member List');
    });
  
    it('Back to Member List button should route to /members', inject([Location], (location) => {
      let btn = fixture.debugElement.query(By.css('#back'));   
      btn.nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/members');
      });
    }));
  
    it('form does not displays if loading flag is true', () => {
      component.loading = true;
      fixture.detectChanges();
      let formElm = fixture.debugElement.query(By.css('form'));
      expect(formElm).toBeNull();
    });
  
    it('form displays if loading flag is false', () => {
      component.loading = false;
      fixture.detectChanges();
      let formElm = fixture.debugElement.query(By.css('form'));
      expect(formElm.queryAll.length).toEqual(1);
    });
  
    it('should display Save Member button if memberForm is valid and not pristine', () => {
      component.loading = false;
      component.memberForm.patchValue(mockMember);
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#save'));
      const btnText = btn.nativeElement.textContent;
      expect(btnText.trim()).toEqual('Save Member');
    });
  
    it('Should display Edit Member button if action is \"READ" and member is found', () => {
      component.loading = false;
      component.action = 'READ';
      component.member = mockMember;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#edit'));
      const btnText = btn.nativeElement.textContent;
      expect(btnText.trim()).toEqual('Edit Member');
    });
  
    it('Should not display Edit Member button if action is not \"READ"', () => {
      component.loading = false;
      component.action = 'ADD';
      component.member = mockMember;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#edit'));
      expect(btn).toBeNull();
    });
  
    it('Edit Member button when clicked should call editMember function', () => {
      spyOn(component, 'editMember');
      component.loading = false;
      component.action = 'READ';
      component.member = mockMember;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#edit'));
      btn.nativeElement.click();
      expect(component.editMember).toHaveBeenCalledWith(mockMember);
    });
  
    it('Should not display Edit Member button if member is not found', () => {
      component.loading = false;
      component.action = 'READ';
      component.member = undefined;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#edit'));
      expect(btn).toBeNull();
    });
  
    it('Should display Delete Member button if action is not \"ADD" and member is found', () => {
      component.loading = false;
      component.action = 'Edit';
      component.member = mockMember;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#delete'));
      const btnText = btn.nativeElement.textContent;
      expect(btnText.trim()).toEqual('Delete Member');
    });
  
    it('Delete Member button when clicked should call deleteMember function', () => {
      spyOn(component, 'deleteMember');
      component.loading = false;
      component.action = 'Edit';
      component.member = mockMember;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#delete'));
      btn.nativeElement.click();
      expect(component.deleteMember).toHaveBeenCalledWith(mockMember);
    })
  
    it('Should not display Delete Member button if action is \"ADD"', () => {
      component.loading = false;
      component.action = 'Add';
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#delete'));
      expect(btn).toBeNull();
    });
  });

  describe('#displayForm', () => {
    beforeEach(() => {
      serviceSpy = TestBed.get(AppService);
      serviceSpy.getTeams.and.returnValue(of(mockTeams));
      window.history.pushState({ action: 'ADD' }, '', '');
      fixture.detectChanges();

      component.member = undefined;
      component.action = '';
      component.title = '';
      component.editMode = false;
      component.alertMessage = '';
    });

    it('should update title, set form to edit mode, and reset form if action is ADD', () => {
      component.routerParams = {action: 'ADD'};
      component.displayForm();
      expect(component.title).toEqual('Add a Member to Racing Team');
      expect(component.action).toEqual('ADD');
      expect(component.editMode).toBeTruthy();
      expect(component.alertMessage).toEqual('');
    });

    it('should update title, set form to edit mode if action is EDIT and member is in router param', () => {
      component.routerParams = {action: 'EDIT', member: mockMember};
      component.displayForm();
      expect(component.member).toEqual(mockMember);
      expect(component.title).toEqual('Edit Member John Doe');
      expect(component.action).toEqual('EDIT');
      expect(component.editMode).toBeTruthy();
      expect(component.alertMessage).toEqual('');
    });

    it('should only update action and alertMessage if action is EDIT, but no member is in router param', () => {
      component.routerParams = {action: 'EDIT'};
      component.displayForm();
      expect(component.member).toBeUndefined();
      expect(component.title).toEqual('');
      expect(component.action).toEqual('EDIT');
      expect(component.editMode).toBeFalsy();
      expect(component.alertMessage).toEqual('No member found.');
    });

    it('should display member info on the page and set to read only if action is READ and member is in router param', () => {
      component.routerParams = {action: 'READ', member: mockMember};
      component.displayForm();
      expect(component.member).toEqual(mockMember);
      expect(component.title).toEqual('Member Detail: John Doe');
      expect(component.action).toEqual('READ');
      expect(component.editMode).toBeFalsy();
      expect(component.alertMessage).toEqual('');
    });

    it('should only update action and alertMessage if action is READ, but no member is in router param', () => {
      component.routerParams = {action: 'READ'};
      component.displayForm();
      expect(component.member).toBeUndefined();
      expect(component.title).toEqual('');
      expect(component.action).toEqual('READ');
      expect(component.editMode).toBeFalsy();
      expect(component.alertMessage).toEqual('No member found.');
    });
  });
  
  it('TEST #deleteMember', () => {

  });

  it('TEST #editMember', () => {
    component.memberForm = mockForm;
    expect(component.member).toBeUndefined();
    expect(component.action).toEqual('READ');
    expect(component.editMode).toBeFalsy();
    expect(component.title).toBeUndefined();
    expect(component.selectedTeam).toEqual('');
    component.memberForm.disable();
    expect(component.memberForm.enabled).toBeFalsy();

    component.editMember(mockMember);
    expect(component.member).toEqual(mockMember);
    expect(component.action).toEqual('EDIT');
    expect(component.editMode).toBeTruthy();
    expect(component.title).toEqual('Edit Member John Doe');
    expect(component.selectedTeam).toEqual(mockMember.team);
    expect(component.memberForm.enabled).toBeTruthy();
  });

  it('TEST #onSubmit', () => {
    
  });

  it('goHome', () => {
    
  })
  
});
