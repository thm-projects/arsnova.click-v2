import { IMemberSerialized } from '../../app/lib/interfaces/entities/Member/IMemberSerialized';

export const MemberMock: IMemberSerialized = {
  colorCode: '',
  currentQuizName: '',
  groupName: '',
  id: '',
  responses: [
    {
      value: [],
      responseTime: -1,
      readingConfirmation: false,
      confidence: undefined,
    },
  ],
  ticket: '',
  name: 'user-test',
};
