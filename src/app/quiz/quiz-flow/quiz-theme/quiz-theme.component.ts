import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { ThemesService } from '../../../service/themes/themes.service';

@Component({
  selector: 'app-quiz-theme',
  templateUrl: './quiz-theme.component.html',
  styleUrls: ['./quiz-theme.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuizThemeComponent implements OnDestroy {
  public static TYPE = 'QuizThemeComponent';

  private previewThemeBackup: string;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _subscriptions: Array<Subscription> = [];
  private _serverUnavailableModal: NgbModalRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private quizService: QuizService,
    private themesService: ThemesService,
    private connectionService: ConnectionService,
    private ngbModal: NgbModal,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizThemeComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    if (isPlatformBrowser(this.platformId)) {
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];

      this._subscriptions.push(this.connectionService.serverStatusEmitter.subscribe(isConnected => {
        if (isConnected) {
          if (this._serverUnavailableModal) {
            this._serverUnavailableModal.dismiss();
          }
          return;
        } else if (!isConnected && this._serverUnavailableModal) {
          return;
        }

        this.ngbModal.dismissAll();
        this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent);
        this._serverUnavailableModal.result.finally(() => this._serverUnavailableModal = null);
      }));
    }
  }

  public ngOnDestroy(): void {
    this.themesService.updateCurrentlyUsedTheme();
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public updateTheme(id: string): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    this.quizService.quiz.sessionConfig.theme = id;

    this.quizService.toggleSettingByName('theme', id);
  }

  public previewTheme(id): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    }
  }

  public restoreTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

      if (themeDataset === this.previewThemeBackup) {
        return;
      }

      document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;
    }

    this.themesService.reloadLinkNodes(this.previewThemeBackup);
  }

}
