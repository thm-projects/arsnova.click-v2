import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownBarComponent } from './markdown-bar.component';

describe('MarkdownBarComponent', () => {
  let component: MarkdownBarComponent;
  let fixture: ComponentFixture<MarkdownBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
