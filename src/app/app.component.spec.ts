import { TestBed, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { APP_BASE_HREF } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppService } from './app.service';

describe('AppComponent', () => {
  class serviceSpy {
    username: string = 'name 1';
    setUsername(name: string): void {
      this.username = name;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, BannerComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppService, userClass: serviceSpy }]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'softrams-racing'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('softrams-racing');
  }));

  it('should set user name in service if it has not been set', () => {
    // const fixture = TestBed.createComponent(BannerComponent);
    // const component = fixture.componentInstance;
    // spyOn(component.appService, 'setUsername');
    // spyOn(localStorage, 'getItem').and.returnValue('user 999');
    // fixture.detectChanges();
    // expect(component.appService.setUsername).toHaveBeenCalled();
  });
});
