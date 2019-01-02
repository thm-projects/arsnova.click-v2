export interface ILoginSerialized {
  name: string;
  passwordHash: string;
  gitlabToken: string;
  userAuthorizations: Array<any>;
}
