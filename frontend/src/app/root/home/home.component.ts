import {Component, OnInit} from '@angular/core';
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {DefaultQuestionGroup} from "../../../lib/questions/questiongroup_default";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AvailableQuizzesComponent} from "../../modals/available-quizzes/available-quizzes.component";
import {WebsocketService} from "../../service/websocket.service";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  public canJoinQuiz = false;
  public canAddQuiz = false;
  public canEditQuiz = false;
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName: string = '';
  private socket: Subject<any>;
  private message: string = 'testmessage';

  constructor(private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private modalService: NgbModal,
              private activeQuestionGroupService: ActiveQuestionGroupService,
              private websocketService: WebsocketService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemAbout,
      FooterBarComponent.footerElemTranslation,
      FooterBarComponent.footerElemTheme,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemHashtagManagement,
      FooterBarComponent.footerElemImport,
    ]);
    this.socket = websocketService.createWebsocket();
    headerLabelService.setHeaderLabel("default");
    const ownedQuizzes = window.localStorage.getItem('owned_quizzes');
    if (ownedQuizzes && JSON.parse(ownedQuizzes).length > 0) {
      this.modalService.open(AvailableQuizzesComponent);
    }
    this.activeQuestionGroupService.activeQuestionGroup = null;
  }

  ngOnInit(): void {
    let done = false;
    this.socket.subscribe(
      message => {
        if (!done) {
          this.socket.next({initData: 'local'});
          done = !done;
        }
        this.message = message;
      },
      message => {
        console.log('error', message);
        this.message = message;
      },
      () => {
        console.log('completed');
      }
    );
  }

  parseQuiznameInput(event: any) {
    const quizname = event.target.value.trim();
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;
    if (quizname.toLowerCase() === "demo quiz") {
      this.isAddingDemoQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
    } else if (quizname.indexOf("abcd") > -1 ) {
      this.isAddingABCDQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
    } else {
      if (quizname.length > 3) {
        if ((JSON.parse(window.localStorage.getItem('owned_quizzes')) || []).indexOf(quizname) > -1) {
          this.canEditQuiz = true;
        } else {
          //TODO: Query server if the quiz exists
          this.canAddQuiz = true;
        }
      }
    }
  }
}
