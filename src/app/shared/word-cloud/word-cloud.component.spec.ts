import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagCloudModule } from 'angular-tag-cloud-module';

import { WordCloudComponent } from './word-cloud.component';

describe('WordCloudComponent', () => {
  let component: WordCloudComponent;
  let fixture: ComponentFixture<WordCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TagCloudModule],
      declarations: [ WordCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
