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
  get showQrCode(): boolean {
    return this._showQrCode;
  }

  set showQrCode(value: boolean) {
    this._showQrCode = value;
  }

  get qrCodeContent(): string {
    return this._qrCodeContent;
  }

  set qrCodeContent(value: string) {
    this._qrCodeContent = value;
  }

  private _showQrCode = false;
  private _qrCodeContent = '';

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
