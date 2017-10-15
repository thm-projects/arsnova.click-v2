import {Component, OnInit} from '@angular/core';
import {CurrentQuizService} from '../../service/current-quiz.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {

  constructor(private currentQuizService: CurrentQuizService) {
    console.log(this.currentQuizService.currentQuestion, currentQuizService.hashtag);
  }

  ngOnInit() {
  }

}
