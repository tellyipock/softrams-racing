import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { MembersComponent } from './members.component';

import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [HttpClientModule, RouterModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addMemberButton should call goToAddMemberForm function when clicked', () => {
    let btn = fixture.debugElement.query(By.css('#addMemberButton'));
    spyOn(component, 'goToAddMemberForm');
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.goToAddMemberForm).toHaveBeenCalled();

  })

  it('#goToAddMemberForm should route to member-details', inject([Router], (router: Router) => {
    component.goToAddMemberForm();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/member-details']);
  }));
});
