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
    "id": 2,
    "firstName": "Jeb",
    "lastName": "Jackson",
    "jobTitle": "Reserve Driver",
    "team": "Formula 1 - Car 77",
    "status": "Inactive"
  },
  {
    "id": 3,
    "firstName": "TestF",
    "lastName": "TestL",
    "jobTitle": "Mock Job",
    "team": "Mock Team",
    "status": "Active"
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.get(AppService);
  });

  it('Add Member button should exist', () => {
    let btn = fixture.debugElement.query(By.css('#add'));
    const btnText = btn.nativeElement.textContent;
    expect(btnText.trim()).toEqual('Add Member');
  });


  describe('no alert message', () => {
    beforeEach(() => {
      window.history.pushState({ }, '', '');
      serviceSpy.getMembers.and.returnValue(of([]));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should NOT update alertMessage', () => {
      window.history.pushState({ }, '', '');
      fixture.detectChanges();
      expect(component.alertMessage).toBeUndefined();
    });    
  });

  describe('has alert message', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MembersComponent);
      component = fixture.componentInstance;
      window.history.pushState({ message: 'Add member success!' }, '', '');
    });

    it('members should be empty', () => {
      serviceSpy.getMembers.and.returnValue(of([]));    
      fixture.detectChanges();
      expect(component.members).toEqual([]);
    })

    describe('has member', () => {
      beforeEach(() => {
        serviceSpy.getMembers.and.returnValue(of(mockMembers));     
        fixture.detectChanges();
      });

      it('should update alertMessage with routing param', () => {
        expect(component.alertMessage).toEqual('Add member success!');
      });
    
      it('should get members', () => {
        fixture.whenStable().then(() => {
          expect(component.members).toEqual(mockMembers);
        });
      });

      it('#openMemberDetails should route to member-details', inject([Router], (router: Router) => {
        component.openMemberDetails('READ', mockMember);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/member-details',
          { state: { action: 'READ', member: mockMember } });
  
        component.openMemberDetails('ADD');
        expect(router.navigateByUrl).toHaveBeenCalledWith('/member-details',
          { state: { action: 'ADD', member: undefined } });
      }));
    
      it('#deleteMembers should not delete member if user selects cancel on confirm dialog', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteMember(mockMember);
        expect(serviceSpy.deleteMember).not.toHaveBeenCalled();
      });
    
      it('#deleteMembers should delete member if user selects confirm on dialog', () => {
        serviceSpy.deleteMember.and.returnValue({
          subscribe: () => {}
        });
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteMember(mockMember);
        expect(serviceSpy.deleteMember).toHaveBeenCalled();
      });
    
      it('#deleteMembers should call getMembers if delete is successful', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        serviceSpy.deleteMember.and.returnValue({
          subscribe: () => { return { SUCCESS: true }; }
        });
        component.deleteMember(mockMember);
        expect(serviceSpy.getMembers).toHaveBeenCalled();
      });
    
      it('#deleteMembers should NOT call getMembers if delete failed', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(component, 'getMembers');
        serviceSpy.deleteMember.and.returnValue({
          subscribe: () => { return { SUCCESS: false }; }
        });
        component.deleteMember(mockMember);
        expect(component.getMembers).not.toHaveBeenCalled();
      });
    
      it('#getMembers should update members from service', () => {
        component.getMembers();
        expect(serviceSpy.getMembers).toHaveBeenCalled();
      });
  
      /* Testing the template */
  
      it('should display members table', () => {
        const compiled = fixture.debugElement.nativeElement;
        const table = compiled.querySelector('tbody');
        const memberArrayLen = mockMembers.length;
        expect(table.children.length).toEqual(memberArrayLen);
  
        Array.from(table.children).forEach((node: HTMLElement, i) => {
          const tds = Array.from(node.querySelectorAll('td'));
          expect(tds[2].innerHTML.trim()).toEqual(mockMembers[i].lastName);
        });
      });
  
      it('Should show an Edit button', () => {
        let btn = fixture.debugElement.query(By.css('.editButton'));
        const btnText = btn.nativeElement.textContent;
        expect(btnText.trim()).toEqual('Edit');
      });
  
      it('Should show a Delete button', () => {
        let btn = fixture.debugElement.query(By.css('.deleteButton'));
        const btnText = btn.nativeElement.textContent;
        expect(btnText.trim()).toEqual('Delete');
      });
  
      it('should not display data if member is empty', () => {
        component.members = [];
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        const table = compiled.querySelector('tbody');
        expect(table.children.length).toEqual(0);
      });
  
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
    })

    
  
    

  });

});
