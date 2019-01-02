import { MemberEntity } from './MemberEntity';

export class MemberGroupEntity {
  public members: Array<MemberEntity>;
  public name: string;

  constructor(data) {
    this.name = data.name;
    this.members = data.members;
  }
}
