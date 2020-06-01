import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faAlignLeft,
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
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
  faCheckSquare,
  faCloudUploadAlt,
  faCode,
  faCogs,
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
  faKey,
  faKeyboard,
  faLanguage,
  faListUl,
  faLock,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMinus,
  faMobileAlt,
  faMusic,
  faPaperPlane,
  faPause,
  faPlay,
  faPlus,
  faQrcode,
  faQuestion,
  faSave,
  faSignInAlt,
  faSignOutAlt,
  faSlidersH,
  faSpinner,
  faSquare,
  faStop,
  faStrikethrough,
  faTags,
  faThumbsUp,
  faTimes,
  faTrash,
  faTrophy,
  faUnderline,
  faUndo,
  faUnlock,
  faUpload,
  faUserFriends,
  faUsers,
  faVolumeMute,
  faVolumeUp,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { NgbAlertModule, NgbModalModule, NgbPopoverModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { environment } from '../../environments/environment';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { GamificationAnimationComponent } from './gamification-animation/gamification-animation.component';
import { NoDataErrorComponent } from './no-data-error/no-data-error.component';
import { WordCloudComponent } from './word-cloud/word-cloud.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    RouterModule,
    AngularSvgIconModule,
    TranslateModule.forChild(),
    TagCloudModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    RouterModule,
    AudioPlayerComponent,
    GamificationAnimationComponent,
    AngularSvgIconModule,
    NoDataErrorComponent,
    WordCloudComponent,
  ],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent, NoDataErrorComponent, WordCloudComponent],
  bootstrap: [],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    if (environment.enableTwitter) {
      library.addIcons(faTwitter);
    }
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
    library.addIcons(faSquare);
    library.addIcons(faCheckSquare);
    library.addIcons(faKey);
    library.addIcons(faPlus);
    library.addIcons(faMinus);
    library.addIcons(faCloudUploadAlt);
    library.addIcons(faCogs);
    library.addIcons(faTags);
    library.addIcons(faUserFriends);
    library.addIcons(faMobileAlt);
    library.addIcons(faAngleUp);
    library.addIcons(faAngleDoubleUp);
    library.addIcons(faAngleDown);
    library.addIcons(faAngleDoubleDown);
    library.addIcons(faVolumeUp);
    library.addIcons(faVolumeMute);
    library.addIcons(faKeyboard);
    library.addIcons(faLongArrowAltLeft);
    library.addIcons(faLongArrowAltRight);
  }
}
