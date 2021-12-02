import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MembersComponent } from './members.component';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [
        HttpClientModule,
        RouterModule
      ],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigateByUrl = jasmine.createSpy('navigateByUrl');
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

  it('#openMemberDetails should route to member-details', inject([Router], (router: Router) => {
    component.openMemberDetails('ADD');
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/member-details',
      { state: { action: 'ADD', member: undefined } });
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
