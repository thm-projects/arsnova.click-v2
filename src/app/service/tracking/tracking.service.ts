import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { TRACKING_CATEGORY_TYPE } from '../../shared/enums';
import { ArsnovaClickAngulartics2Piwik } from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';

interface ITrackEvent {
  action: string;
  category: TRACKING_CATEGORY_TYPE;
  label: string;
  value?: number;
  customDimensions?: any;
}

export interface ITrackClickEvent {
  action: string;
  label: string;
  value?: number;
  customDimensions?: any;
}

export interface ITrackConversionEvent {
  action: string;
  label?: string;
}


@Injectable()
export class TrackingService {

  constructor(private angulartics2: Angulartics2, private angulartics2Piwik: ArsnovaClickAngulartics2Piwik) {
  }

  public trackEvent({ category, action, label, value, customDimensions = {} }: ITrackEvent): void {
    this.angulartics2Piwik.setUserProperties(customDimensions);
    this.angulartics2.eventTrack.next({
      action,
      properties: {
        category: TRACKING_CATEGORY_TYPE[category].toLowerCase(),
        label,
        value,
      },
    });
  }

  public trackConversionEvent({ action, label = '' }: ITrackConversionEvent): void {
    this.trackEvent({
      category: TRACKING_CATEGORY_TYPE.CONVERSION,
      action,
      label,
    });
  }

  public trackClickEvent({ action, label, value, customDimensions = {} }: ITrackClickEvent): void {
    this.trackEvent({
      category: TRACKING_CATEGORY_TYPE.CLICK,
      action,
      label,
      value,
      customDimensions,
    });
  }

}
