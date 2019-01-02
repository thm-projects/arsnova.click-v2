import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from '../../service/connection/connection.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public static TYPE = 'HeaderComponent';

  private _origin: string = isPlatformBrowser(this.platformId) ? location.hostname : '';

  get origin(): string {
    switch (this._origin) {
      case 'beta.arsnova.click':
        return 'Beta';
      case 'staging.arsnova.click':
        return 'Staging';
      case 'localhost':
        return 'DEV';
      default:
        return '';
    }
  }

  private _inHomeRoute: boolean;

  get inHomeRoute(): boolean {
    return this._inHomeRoute;
  }

  set inHomeRoute(value: boolean) {
    this._inHomeRoute = value;
  }

  get indexedDbAvailable(): boolean {
    return this._indexedDbAvailable;
  }

  private readonly _indexedDbAvailable: boolean = this.indexedDbSupported();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,
    public headerLabelService: HeaderLabelService,
    public connectionService: ConnectionService,
    private trackingService: TrackingService,
  ) {
  }

  public generateConnectionQualityColor(): SafeStyle {
    const colorCode = this.connectionService.lowSpeed || //
                      !this.indexedDbAvailable ? 'var(--danger)' : //
                      this.connectionService.mediumSpeed ? 'var(--danger)' : //
                      !this.connectionService.serverAvailable ? 'var(--grey)' : 'var(--success)';

    return this.sanitizeStyle(colorCode);
  }

  public ngOnInit(): void {
    this.router.events.subscribe((url: any) => {
      if (isPlatformBrowser(this.platformId)) {
        this.inHomeRoute = (location.pathname === '/home' || location.pathname === '/');
      }
    });
  }

  public openConnectionQualityModal(content: string): void {
    this.trackingService.trackClickEvent({
      action: 'ConnectionQualityModal',
      label: 'open-dialog',
      customDimensions: {
        dimension1: this.connectionService.lowSpeed,
        dimension2: this.connectionService.mediumSpeed,
        dimension3: this.connectionService.rtt,
        dimension4: this.connectionService.serverAvailable,
        dimension5: this.connectionService.websocketAvailable,
        dimension6: this.indexedDbAvailable,
      },
    });

    this.modalService.open(content);
    this.connectionService.calculateRTT();
  }

  private sanitizeStyle(value: string): SafeStyle {
    if (isPlatformServer(this.platformId)) {
      return value;
    }

    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  private indexedDbSupported(): boolean {
    return (isPlatformBrowser(this.platformId) && //
            'indexedDB' in window //
    );
  }
}
