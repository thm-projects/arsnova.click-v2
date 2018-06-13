import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nManagerComponent } from './i18n-manager.component';

describe('FeTranslationComponent', () => {
  let component: I18nManagerComponent;
  let fixture: ComponentFixture<I18nManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [I18nManagerComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I18nManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain a TYPE reference', () => {
    expect(I18nManagerComponent.TYPE).toEqual('I18nManagerComponent');
  });
});
