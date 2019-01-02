export interface IUserBase {
  name: string;
  passwordHash: string;
  token?: string;
  gitlabToken?: string;
}
