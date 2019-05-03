import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../lib/AutoUnsubscribe';
import { ConnectionService } from '../../service/connection/connection.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class HeaderComponent implements OnInit, OnDestroy {
  public static TYPE = 'HeaderComponent';

  @Input() public showHeader = true;
  public isCheckingForUpdates: boolean;

  private _origin: string = isPlatformBrowser(this.platformId) ? location.hostname : '';

  get origin(): string {
    switch (this._origin) {
      case 'beta.arsnova.click':
        return 'Beta';
      case 'staging.arsnova.click':
        return 'Staging';
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

  private _subscriptions: Array<Subscription> = [];

  @ViewChild('connectionIndicatorPopover') private connectionIndicatorPopover: NgbPopover;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public headerLabelService: HeaderLabelService,
    public connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    private updateCheckService: UpdateCheckService,
    private updates: SwUpdate,
  ) {
  }

  public generateConnectionQualityColor(): SafeStyle {
    const colorCode = this.connectionService.lowSpeed || //
                      !this.indexedDbAvailable ? 'var(--danger)' : //
                      this.connectionService.mediumSpeed ? 'var(--danger)' : //
                      !this.connectionService.serverAvailable || !this.connectionService.websocketAvailable ? 'var(--grey)' : 'var(--light)';

    return this.sanitizeStyle(colorCode);
  }

  public ngOnInit(): void {
    this.router.events.subscribe((url: any) => {
      if (isPlatformBrowser(this.platformId)) {
        this.inHomeRoute = (location.pathname === '/home' || location.pathname === '/');
      }
    });

    this._subscriptions.push(this.connectionService.serverStatusEmitter.subscribe(() => {
      if (this.connectionService.serverAvailable || this.headerLabelService.isUnavailableModalOpen) {
        this.connectionIndicatorPopover.close();
      } else {
        this.connectionIndicatorPopover.open();
      }
    }));
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public openConnectionQualityModal(content: TemplateRef<any>): void {
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
    if (!this.connectionService.websocketAvailable) {
      this.connectionService.initWebsocket();
    }
  }

  public checkForUpdates(): void {
    this.isCheckingForUpdates = true;
    if (this.updates.isEnabled) {
      this.updateCheckService.doCheck().catch(err => console.error(err)).finally(() => this.isCheckingForUpdates = false);
    } else {
      location.reload(true);
    }
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
