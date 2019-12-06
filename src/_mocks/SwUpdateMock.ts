import { UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';

export class SwUpdateMock {
  public isEnabled: true;

  public readonly available: Subject<UpdateAvailableEvent> = new Subject<UpdateAvailableEvent>();
  public readonly activated: Subject<UpdateActivatedEvent> = new Subject<UpdateActivatedEvent>();

  public checkForUpdate(): Promise<void> {
    return new Promise<void>(resolve => resolve());
  }
}
