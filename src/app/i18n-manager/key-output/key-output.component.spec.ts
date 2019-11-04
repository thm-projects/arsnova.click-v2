import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { CasLoginService } from '../../service/login/cas-login.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { KeyOutputComponent } from './key-output.component';

@Pipe({
  name: 'unusedKeyFilter',
})
export class UnusedKeyFilterMockPipe implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}

@Pipe({
  name: 'filterKeys',
})
export class FilterKeysMockPipe implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}

@Pipe({
  name: 'justafew',
})
export class JustafewMockPipe implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterMockPipe implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}

@Pipe({
  name: 'sort',
})
export class SortMockPipe implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}

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
      declarations: [KeyOutputComponent, UnusedKeyFilterMockPipe, FilterKeysMockPipe, JustafewMockPipe, SearchFilterMockPipe, SortMockPipe],
      providers: [
        IndexedDbService, {
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
