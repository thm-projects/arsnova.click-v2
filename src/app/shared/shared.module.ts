import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
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

library.add(faTimes);
library.add(faSpinner);
library.add(faInfoCircle);
library.add(faGlobe);
library.add(faAppleAlt);
library.add(faArrowsAlt);
library.add(faWrench);
library.add(faUpload);
library.add(faLanguage);
library.add(faUnlock);
library.add(faSignOutAlt);
library.add(faSignInAlt);
library.add(faHome);
library.add(faExclamationTriangle);
library.add(faPaperPlane);
library.add(faEdit);
library.add(faDownload);
library.add(faTrash);
library.add(faCaretLeft);
library.add(faCaretRight);
library.add(faCaretSquareDown);
library.add(faCaretUp);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faUsers);
library.add(faMusic);
library.add(faFlag);
library.add(faUndo);
library.add(faBold);
library.add(faHeading);
library.add(faListUl);
library.add(faCode);
library.add(faImage);
library.add(faHourglass);
library.add(faLock);
library.add(faPlay);
library.add(faPause);
library.add(faStop);
library.add(faThumbsUp);
library.add(faEye);
library.add(faQrcode);
library.add(faAlignLeft);
library.add(faSlidersH);
library.add(faQuestion);
library.add(faCaretSquareUp);
library.add(faCheck);
library.add(faUnderline);
library.add(faStrikethrough);
library.add(faItalic);
library.add(faTrophy);
library.add(faBan);
library.add(faSave);
library.add(faCopy);

@NgModule({
  imports: [
    FormsModule, CommonModule, HttpClientModule, FontAwesomeModule, NgbModule, RouterModule, AngularSvgIconModule,
  ],
  exports: [
    FormsModule, CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule,
    NgbModule,
    RouterModule,
    AudioPlayerComponent,
    GamificationAnimationComponent,
    AngularSvgIconModule,
  ],
  providers: [],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent],
  bootstrap: [],
})
export class SharedModule {
  constructor() {}
}
