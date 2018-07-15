import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '../../pipes/pipes.module';
import { CasLoginService } from '../../service/login/cas-login.service';
import { UserService } from '../../service/user/user.service';
import { SharedModule } from '../../shared/shared.module';

import { KeyOutputComponent } from './key-output.component';

describe('KeyOutputComponent', () => {
  let component: KeyOutputComponent;
  let fixture: ComponentFixture<KeyOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, PipesModule],
      declarations: [KeyOutputComponent],
      providers: [
        CasLoginService, UserService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain a TYPE reference', () => {
    expect(KeyOutputComponent.TYPE).toEqual('KeyOutputComponent');
  });
});
