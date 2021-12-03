import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MembersComponent } from './members.component';
import { MessageComponent } from '../shared/message/message.component';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});
