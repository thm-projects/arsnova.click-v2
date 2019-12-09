import { QuizEntity } from '../../app/lib/entities/QuizEntity';
import { MusicSessionConfigurationEntity } from '../../app/lib/entities/session-configuration/MusicSessionConfigurationEntity';
import { NickSessionConfigurationEntity } from '../../app/lib/entities/session-configuration/NickSessionConfigurationEntity';
import { SessionConfigurationEntity } from '../../app/lib/entities/session-configuration/SessionConfigurationEntity';
import { QuizState } from '../../app/lib/enums/QuizState';
import { QuizVisibility } from '../../app/lib/enums/QuizVisibility';

export const QuizMock: QuizEntity = new QuizEntity({
  currentQuestionIndex: 0,
  currentStartTimestamp: 0,
  description: '',
  expiry: undefined,
  memberGroups: undefined,
  questionList: undefined,
  sessionConfig: new SessionConfigurationEntity({
    nicks: new NickSessionConfigurationEntity({ selectedNicks: [] }),
    music: new MusicSessionConfigurationEntity({}),
  }),
  state: QuizState.Active,
  visibility: QuizVisibility.Account,
  name: 'quiz-test',
});
