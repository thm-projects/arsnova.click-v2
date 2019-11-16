import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IHasTriggeredNavigation } from '../../lib/interfaces/IHasTriggeredNavigation';

@Injectable({
  providedIn: 'root',
})
export class ShowUnloadWarningGuard<T extends IHasTriggeredNavigation> implements CanDeactivate<T> {

  constructor(private translate: TranslateService) {}

  public canDeactivate(component): boolean {
    if (component && component.hasTriggeredNavigation) {
      return true;
    }

    return confirm(this.translate.instant('global.loose-data-warning'));
  }
}
