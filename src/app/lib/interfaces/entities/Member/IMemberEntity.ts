import { ICasData } from '../../users/ICasData';
import { IMemberBase } from './IMemberBase';

export interface IMemberEntity extends IMemberBase {
  casProfile: ICasData;
}
