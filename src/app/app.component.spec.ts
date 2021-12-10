import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { AppService } from './shared/app.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let serviceSpy: jasmine.SpyObj<AppService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, BannerComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppService, useValue: jasmine.createSpyObj('AppService', ['setUsername']) }]
    }).compileComponents();
  }));

  beforeEach( () => {
    fixture = TestBed.createComponent(AppComponent);
  })

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should set user name in service if it has not been set in appService', () => {
    const mockUser = 'mock user 1'
    serviceSpy = TestBed.get(AppService);
    serviceSpy.username = '';
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return mockUser;
    });
    fixture.detectChanges();
    expect(serviceSpy.setUsername).toHaveBeenCalledWith(mockUser);
  });

  it('should not set user name in service if it has been in appService', () => {
    serviceSpy = TestBed.get(AppService);
    serviceSpy.username = 'mock user 2';
    
    expect(serviceSpy.setUsername).not.toHaveBeenCalled();
  });

  it('should display h1', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Softrams Racing');

    const element = fixture.debugElement.queryAll(By.css('.lead'));
    expect(element[0].nativeElement.innerText.trim()).toEqual('Redefining digital frontiers.');
  });

  it('should display login user name and logout link if user exists', () => {
    serviceSpy = TestBed.get(AppService);
    serviceSpy.username = 'Mock User';
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(By.css('.welcome'));
    expect(element[0].nativeElement.innerText.trim()).toEqual('Welcome Mock User, logout here');
  });

  it('should NOT display login user name or logout link if user does not exist', () => {
    serviceSpy = TestBed.get(AppService);
    serviceSpy.username = '';
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(By.css('.welcome'));
    expect(element).toEqual([ ]);
  })
});
