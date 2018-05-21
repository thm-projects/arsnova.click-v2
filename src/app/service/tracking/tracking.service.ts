import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { ArsnovaClickAngulartics2Piwik } from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';

export enum EventType {
  INTERACTION, NON_INTERACTION
}

export enum CategoryType {
  CLICK, CONVERSION, THEME_CHANGE, THEME_PREVIEW
}

interface ITrackEvent {
  action: string;
  category: CategoryType;
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

  constructor(
    private angulartics2: Angulartics2,
    private angulartics2Piwik: ArsnovaClickAngulartics2Piwik,
  ) {
  }

  public trackEvent({ category, action, label, value, customDimensions = {} }: ITrackEvent): void {
    this.angulartics2Piwik.setUserProperties(customDimensions);
    this.angulartics2.eventTrack.next({
      action,
      properties: {
        category: CategoryType[category].toLowerCase(),
        label,
        value,
      },
    });
  }

  public trackConversionEvent({ action, label = '' }: ITrackConversionEvent): void {
    this.trackEvent({ category: CategoryType.CONVERSION, action, label });
  }

  public trackClickEvent({ action, label, value, customDimensions = {} }: ITrackClickEvent): void {
    this.trackEvent({ category: CategoryType.CLICK, action, label, value, customDimensions });
  }

}
