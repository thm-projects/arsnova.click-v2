import { UserEntity } from '../../app/lib/entities/UserEntity';

export const UserMock: UserEntity = {
  name: 'user-test',
  gitlabToken: 'gitlab-token',
  passwordHash: 'password-hash',
  privateKey: 'private-key',
  token: 'token',
  userAuthorizations: [],
};
