import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { Subject } from 'rxjs';

import { HotkeyCheatsheetComponent } from './hotkey-cheatsheet.component';

describe('HotkeyCheatsheetComponent', () => {
  let component: HotkeyCheatsheetComponent;
  let fixture: ComponentFixture<HotkeyCheatsheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NgbActiveModal,
        {
          provide: HotkeysService,
          useValue: {
            cheatSheetToggle: new Subject(),
          }
        },
      ],
      declarations: [ HotkeyCheatsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotkeyCheatsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
