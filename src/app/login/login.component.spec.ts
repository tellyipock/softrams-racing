import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AppService } from '../shared/app.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let serviceSpy: jasmine.SpyObj<AppService>;

  const mockLoginUser = {
    username: 'John Doe',
    password: '123456'
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule, HttpClientModule],
      providers: [
        HttpClient,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        { 
          provide: AppService,
          useValue: jasmine.createSpyObj('AppService', ['setUsername'])
        }        
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.get(AppService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check username in localStorage', () => {
    spyOn(localStorage, 'getItem');
    fixture.detectChanges();
    expect(localStorage.getItem).toHaveBeenCalledWith('username');
  });

  it('should call appService.setUsername if username is found in localStorage', () => {
    const mockUser = 'mock user 1';
    serviceSpy.username = '';
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return mockUser;
    });
    fixture.detectChanges();
    expect(serviceSpy.setUsername).toHaveBeenCalledWith(mockUser);
  });

  it('should initiate loginForm', () => {
    const emptyUser = {
      username: '',
      password: ''
    }
    expect(component.loginForm).toBeUndefined();
    fixture.detectChanges();
    expect(component.loginForm.value).toEqual(emptyUser);
  });

  it('#login should set username in localStorage', () => {
    spyOn(localStorage, 'setItem');
    fixture.detectChanges();
    component.login();
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(serviceSpy.setUsername).toHaveBeenCalled();
  });

});
