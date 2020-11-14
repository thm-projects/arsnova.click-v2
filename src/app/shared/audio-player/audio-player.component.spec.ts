import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';

import { AudioPlayerComponent } from './audio-player.component';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FontAwesomeModule, HttpClientTestingModule, FormsModule,
      ],
      providers: [
        {
          provide: TrackingService,
          useClass: TrackingMockService,
        },
      ],
      declarations: [AudioPlayerComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faStop);
    library.addIcons(faPlay);
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', waitForAsync(() => {
    expect(AudioPlayerComponent.TYPE).toEqual('AudioPlayerComponent');
  }));
});
