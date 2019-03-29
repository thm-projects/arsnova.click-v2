import { UserRole } from '../enums/UserRole';

export class UserEntity {
  public token: string;
  public userAuthorizations: Array<UserRole>;
  public name: string;
  public passwordHash: string;
  public gitlabToken: string;
  public privateKey: string;

  constructor(props) {
    this.token = props.token;
    this.userAuthorizations = props.userAuthorizations;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    this.gitlabToken = props.gitlabToken;
    this.privateKey = props.privateKey;
  }
}
