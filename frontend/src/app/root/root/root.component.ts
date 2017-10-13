import {Component, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';
import {QrCodeService} from '../../service/qr-code.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  private showQrCode = false;
  private qrCodeContent = '';

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private qrCodeService: QrCodeService) {
    themesService.updateCurrentlyUsedTheme();
    this.qrCodeContent = qrCodeService.qrCodeContent;
    qrCodeService.getSubscription().subscribe(value => {
      this.showQrCode = value;
    });
  }

  getFooterBarElements() {
    return this.footerBarService.footerElements;
  }

  getHeaderLabel() {
    return this.headerLabelService.headerLabel;
  }

  ngOnInit() {
  }

}
