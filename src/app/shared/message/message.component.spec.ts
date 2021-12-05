import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
    let btn = fixture.debugElement.query(By.css('#close'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.message).toBeFalsy();
  });
});
