import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FilterKeysPipeMock } from '../../../_mocks/_pipes/FilterKeysPipeMock';
import { JustafewPipeMock } from '../../../_mocks/_pipes/JustafewPipeMock';
import { SearchFilterPipeMock } from '../../../_mocks/_pipes/SearchFilterPipeMock';
import { SortPipeMock } from '../../../_mocks/_pipes/SortPipeMock';
import { UnusedKeyFilterPipeMock } from '../../../_mocks/_pipes/UnusedKeyFilterPipeMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { CasLoginService } from '../../service/login/cas-login.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { KeyOutputComponent } from './key-output.component';

describe('KeyOutputComponent', () => {
  let component: KeyOutputComponent;
  let fixture: ComponentFixture<KeyOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), InfiniteScrollModule, FontAwesomeModule, HttpClientTestingModule,
      ],
      declarations: [KeyOutputComponent, UnusedKeyFilterPipeMock, FilterKeysPipeMock, JustafewPipeMock, SearchFilterPipeMock, SortPipeMock],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, CasLoginService, {
          provide: UserService,
          useValue: {},
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KeyOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', () => {
    expect(KeyOutputComponent.TYPE).toEqual('KeyOutputComponent');
  });
});
