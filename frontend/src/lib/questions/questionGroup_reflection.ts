import {DefaultQuestionGroup} from "./questiongroup_default";
import {SessionConfiguration} from "../session_configuration/session_config";

export const questionGroupReflection = {
	DefaultQuestionGroup: function ({hashtag, questionList, isFirstStart, configuration}): DefaultQuestionGroup {
		return new DefaultQuestionGroup({
      hashtag: hashtag,
      questionList: questionList || [],
      isFirstStart: isFirstStart || true,
      sessionConfig: new SessionConfiguration(configuration) || null
    });
	}
};


