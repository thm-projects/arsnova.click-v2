import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbState, DbTable } from '../../../lib/enums/enums';
import { UserRole } from '../../../lib/enums/UserRole';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-quiz-duplicate',
  templateUrl: './quiz-duplicate.component.html',
  styleUrls: ['./quiz-duplicate.component.scss'],
})
export class QuizDuplicateComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizApiService: QuizApiService,
    private quizService: QuizService,
    private storageService: StorageService,
    private indexedDbService: IndexedDbService,
    private userService: UserService,
  ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(param => {
      if (!param || !param.name || !this.userService.isAuthorizedFor(UserRole.CreateQuiz)) {
        return;
      }

      this.quizApiService.initQuizInstance(param.name).subscribe((data) => {
        this.storageService.create(DbTable.Quiz, data.payload.quiz.name, data.payload.quiz).subscribe(() => {
          this.indexedDbService.stateNotifier.next(DbState.Revalidate);
        });
        this.quizService.quiz = new QuizEntity(data.payload.quiz);
        this.quizService.isOwner = true;
        this.router.navigate(['/quiz', 'flow']).then(() => {
          this.quizService.updateOwnerState();
        });
      });
    });
  }
}
