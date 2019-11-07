import { IMemberSerialized } from '../entities/Member/IMemberSerialized';
import { IMemberGroupBase } from './IMemberGroupBase';

export interface IMemberGroupSerialized extends IMemberGroupBase {
  members?: Array<IMemberSerialized>;
}
