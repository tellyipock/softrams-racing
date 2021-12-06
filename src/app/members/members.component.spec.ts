import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MembersComponent } from './members.component';
import { MessageComponent } from '../shared/message/message.component';
import { AppService } from '../shared/app.service';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let serviceSpy: jasmine.SpyObj<AppService>;

  const serviceStub = {
    getMembers: () => {
       return {
          subscribe: () => {}
       };
    },
 };

 const mockMembers = [
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Driver",
    "team": "Formula 1 - Car 77",
    "status": "Active"
  },
  {
    "id": 3,
    "firstName": "Jeb",
    "lastName": "Jackson",
    "jobTitle": "Reserve Driver",
    "team": "Formula 1 - Car 77",
    "status": "Inactive"
  }
];

  const mockMember = {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Driver",
    "team": "Formula 1 - Car 77",
    "status": "Active"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersComponent, MessageComponent ],
      imports: [
        HttpClientModule,
        RouterModule
      ],
      providers: [
        { 
          provide: AppService,
          useValue: jasmine.createSpyObj('AppService', [ 'deleteMember', 'getMembers' ])
          // userValue: serviceStub
        },
        {
          provide: Router, useClass: class {
            navigateByUrl = jasmine.createSpy('navigateByUrl');
          }
        }
      ]
    }).compileComponents();

    window.history.pushState({ message: 'Add member success!' }, '', '');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.get(AppService);
    serviceSpy.getMembers.and.returnValue(of(mockMembers));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update alertMessage with routing param', () => {
    expect(component.alertMessage).toEqual('Add member success!');
  })

  it('should get members', () => {
    fixture.whenStable().then(() => {
      expect(component.members).toEqual(mockMembers);
    });
  });

  it('#openMemberDetails should route to member-details', inject([Router], (router: Router) => {
    component.openMemberDetails('ADD', mockMember);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/member-details',
      { state: { action: 'ADD', member: mockMember } });
  }));

  /* Testing the template */
  it('add button should call openMemberDetails function when clicked', () => {
    let btn = fixture.debugElement.query(By.css('#add'));
    spyOn(component, 'openMemberDetails');
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.openMemberDetails).toHaveBeenCalledWith('ADD');
  });

  it('edit button should call openMemberDetails function when clicked', () => {
    component.members = mockMembers;
    fixture.detectChanges();

    let btn = fixture.debugElement.queryAll(By.css('.editButton'))[0];
    spyOn(component, 'openMemberDetails');
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.openMemberDetails).toHaveBeenCalledWith('EDIT', mockMembers[0] );
  });

  it('member ID link button should call openMemberDetails function when clicked', () => {
    component.members = mockMembers;
    fixture.detectChanges();

    let btn = fixture.debugElement.queryAll(By.css('.btn-link'))[0];
    spyOn(component, 'openMemberDetails');
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.openMemberDetails).toHaveBeenCalledWith( 'READ', mockMembers[0] );
  });

  it('member name link button should call openMemberDetails function when clicked', () => {
    component.members = mockMembers;
    fixture.detectChanges();

    let btn = fixture.debugElement.queryAll(By.css('.btn-link'))[3];
    spyOn(component, 'openMemberDetails');
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.openMemberDetails).toHaveBeenCalledWith( 'READ', mockMembers[1] );
  });

  it('#deleteMembers should not delete member if user selects cancel on confirm dialog', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteMember(mockMember);
    expect(serviceSpy.deleteMember).not.toHaveBeenCalled();
  });

  it('#deleteMembers should delete member if user selects confirm on dialog', () => {

  });

  it('#getMembers should update members from service', () => {
    component.getMembers();
    expect(serviceSpy.getMembers).toHaveBeenCalled();
  })


});
