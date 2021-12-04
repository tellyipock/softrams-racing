import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BannerComponent } from './banner.component';
import { AppService } from '../app.service';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  class serviceSpy {
    username: string = 'name 1';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
      imports: [ HttpClientTestingModule
        , RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppService, useClass: serviceSpy } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('TEST #login', inject([Router], (router: Router) => {
    spyOn(component.appService, 'username');
    spyOn(localStorage, 'removeItem');
    const routerSpy = spyOn(router, 'navigate');
    component.logout();
    expect(component.appService.username).toEqual('');
    expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    expect(routerSpy.calls.first().args[0]).toContain('/login');
  }));
});
