import { Component, OnInit } from '@angular/core';
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss']
})
export class QuizLobbyComponent implements OnInit {

  constructor(private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private activeQuestionGroupService: ActiveQuestionGroupService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemEditQuiz,
      FooterBarComponent.footerElemStartQuiz,
      FooterBarComponent.footerElemProductTour,
      FooterBarComponent.footerElemNicknames,
      FooterBarComponent.footerElemSound,
      FooterBarComponent.footerElemReadingConfirmation,
      FooterBarComponent.footerElemTheme,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemQRCode,
      FooterBarComponent.footerElemResponseProgress,
      FooterBarComponent.footerElemConfidenceSlider,
    ]);
    headerLabelService.setHeaderLabel("component.quiz_manager.title");
  }

  ngOnInit() {
  }

}
