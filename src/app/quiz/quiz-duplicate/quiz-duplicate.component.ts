import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { UserRole } from '../../lib/enums/UserRole';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-quiz-duplicate',
  templateUrl: './quiz-duplicate.component.html',
  styleUrls: ['./quiz-duplicate.component.scss'],
})
export class QuizDuplicateComponent implements OnInit, OnDestroy {
  private readonly _destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizApiService: QuizApiService,
    private quizService: QuizService,
    private storageService: StorageService,
    private userService: UserService,
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.pipe(map(params => params.get('name')), filter(() => this.userService.isAuthorizedFor(UserRole.CreateQuiz)),
      distinctUntilChanged(), takeUntil(this._destroy), switchMap(name => this.quizApiService.initQuizInstance(name)))
    .subscribe(async data => {
      await this.storageService.db.Quiz.put(data.payload.quiz);
      this.quizService.quiz = new QuizEntity(data.payload.quiz);
      this.quizService.isOwner = true;
      this.router.navigate(['/quiz', 'flow']);
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
