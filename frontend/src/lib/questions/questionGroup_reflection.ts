import {DefaultQuestionGroup} from './questiongroup_default';
import {SessionConfiguration} from '../session_configuration/session_config';
import {ISessionConfiguration} from '../session_configuration/interfaces';

export const questionGroupReflection = {
  DefaultQuestionGroup: function ({hashtag, questionList, isFirstStart, sessionConfig}: { hashtag: string, questionList?: Array<string>, isFirstStart?: boolean, sessionConfig?: ISessionConfiguration }): DefaultQuestionGroup {
    return new DefaultQuestionGroup({
                                      hashtag: hashtag,
                                      questionList: questionList || [],
                                      isFirstStart: isFirstStart || true,
                                      sessionConfig: new SessionConfiguration(sessionConfig) || new SessionConfiguration(null)
                                    });
  }
};


