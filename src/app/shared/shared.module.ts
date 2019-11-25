import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAlignLeft,
  faAppleAlt,
  faArrowDown,
  faArrowsAlt,
  faArrowUp,
  faBan,
  faBold,
  faCaretLeft,
  faCaretRight,
  faCaretSquareDown,
  faCaretSquareUp,
  faCaretUp,
  faCheck,
  faCode,
  faCopy,
  faDownload,
  faEdit,
  faExclamationTriangle,
  faEye,
  faFlag,
  faGlobe,
  faHeading,
  faHome,
  faHourglass,
  faImage,
  faInfoCircle,
  faItalic,
  faLanguage,
  faListUl,
  faLock,
  faMusic,
  faPaperPlane,
  faPause,
  faPlay,
  faQrcode,
  faQuestion,
  faSave,
  faSignInAlt,
  faSignOutAlt,
  faSlidersH,
  faSpinner,
  faStop,
  faStrikethrough,
  faThumbsUp,
  faTimes,
  faTrash,
  faTrophy,
  faUnderline,
  faUndo,
  faUnlock,
  faUpload,
  faUsers,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { GamificationAnimationComponent } from './gamification-animation/gamification-animation.component';
import { NoDataErrorComponent } from './no-data-error/no-data-error.component';

@NgModule({
  imports: [
    FormsModule, CommonModule, FontAwesomeModule, NgbModule, RouterModule, AngularSvgIconModule, TranslateModule.forChild(),
  ],
  exports: [
    FormsModule, CommonModule,
    FontAwesomeModule,
    TranslateModule,
    NgbModule,
    RouterModule,
    AudioPlayerComponent,
    GamificationAnimationComponent,
    AngularSvgIconModule, NoDataErrorComponent,
  ],
  providers: [],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent, NoDataErrorComponent],
  entryComponents: [NoDataErrorComponent],
  bootstrap: [],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes);
    library.addIcons(faSpinner);
    library.addIcons(faInfoCircle);
    library.addIcons(faGlobe);
    library.addIcons(faAppleAlt);
    library.addIcons(faArrowsAlt);
    library.addIcons(faWrench);
    library.addIcons(faUpload);
    library.addIcons(faLanguage);
    library.addIcons(faUnlock);
    library.addIcons(faSignOutAlt);
    library.addIcons(faSignInAlt);
    library.addIcons(faHome);
    library.addIcons(faExclamationTriangle);
    library.addIcons(faPaperPlane);
    library.addIcons(faEdit);
    library.addIcons(faDownload);
    library.addIcons(faTrash);
    library.addIcons(faCaretLeft);
    library.addIcons(faCaretRight);
    library.addIcons(faCaretSquareDown);
    library.addIcons(faCaretUp);
    library.addIcons(faArrowDown);
    library.addIcons(faArrowUp);
    library.addIcons(faUsers);
    library.addIcons(faMusic);
    library.addIcons(faFlag);
    library.addIcons(faUndo);
    library.addIcons(faBold);
    library.addIcons(faHeading);
    library.addIcons(faListUl);
    library.addIcons(faCode);
    library.addIcons(faImage);
    library.addIcons(faHourglass);
    library.addIcons(faLock);
    library.addIcons(faPlay);
    library.addIcons(faPause);
    library.addIcons(faStop);
    library.addIcons(faThumbsUp);
    library.addIcons(faEye);
    library.addIcons(faQrcode);
    library.addIcons(faAlignLeft);
    library.addIcons(faSlidersH);
    library.addIcons(faQuestion);
    library.addIcons(faCaretSquareUp);
    library.addIcons(faCheck);
    library.addIcons(faUnderline);
    library.addIcons(faStrikethrough);
    library.addIcons(faItalic);
    library.addIcons(faTrophy);
    library.addIcons(faBan);
    library.addIcons(faSave);
    library.addIcons(faCopy);
  }
}
