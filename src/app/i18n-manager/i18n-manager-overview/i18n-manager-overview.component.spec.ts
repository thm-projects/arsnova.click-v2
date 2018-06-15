import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nManagerOverviewComponent } from './i18n-manager-overview.component';

describe('I18nManagerOverviewComponent', () => {
  let component: I18nManagerOverviewComponent;
  let fixture: ComponentFixture<I18nManagerOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [I18nManagerOverviewComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I18nManagerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain a TYPE reference', () => {
    expect(I18nManagerOverviewComponent.TYPE).toEqual('I18nManagerOverviewComponent');
  });
});
