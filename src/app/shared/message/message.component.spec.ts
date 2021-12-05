import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add button should set message to false', () => {
    component.message = 'mock message';
    fixture.detectChanges();
    let btn = fixture.debugElement.query(By.css('#close'));
    btn.triggerEventHandler('click', null);
    expect(component.message).toBeFalsy();
  });

  it('add button should not display there is no message', () => {
    component.message = '';
    fixture.detectChanges();
    let btn = fixture.debugElement.query(By.css('#close'));
    expect(btn).toBeFalsy();
  });
});
