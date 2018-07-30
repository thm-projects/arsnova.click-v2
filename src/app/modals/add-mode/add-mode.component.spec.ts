import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { SharedModule } from '../../shared/shared.module';

import { AddModeComponent } from './add-mode.component';

describe('AddModeComponent', () => {
  let component: AddModeComponent;
  let fixture: ComponentFixture<AddModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [StorageService],
          },
        }), SharedModule, NgbModalModule.forRoot(),
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbActiveModal, UserService,
      ],
      declarations: [AddModeComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a TYPE reference', () => {
    expect(AddModeComponent.TYPE).toEqual('AddModeComponent');
  });
});
