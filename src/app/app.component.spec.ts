import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { APP_BASE_HREF } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
});
