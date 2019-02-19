export interface ILoginSerialized {
  privateKey?: string;
  name: string;
  passwordHash: string;
  gitlabToken: string;
  userAuthorizations: Array<any>;
}
