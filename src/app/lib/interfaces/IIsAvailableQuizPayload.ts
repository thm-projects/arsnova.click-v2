import { IMemberGroupSerialized } from './users/IMemberGroupSerialized';

export interface IIsAvailableQuizPayload {
  available?: boolean;
  provideNickSelection?: boolean;
  authorizeViaCas?: boolean;
  maxMembersPerGroup?: number;
  autoJoinToGroup?: boolean;
  memberGroups?: Array<IMemberGroupSerialized>;
}
