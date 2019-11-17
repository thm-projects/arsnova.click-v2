import { TrackingCategoryType } from '../../enums/enums';

export interface ITrackEvent {
  action: string;
  category: TrackingCategoryType;
  label: string;
  value?: number;
  customDimensions?: any;
}
