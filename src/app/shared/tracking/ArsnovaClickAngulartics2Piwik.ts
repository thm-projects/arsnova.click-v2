import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { INamedType } from '../../../lib/interfaces/interfaces';

declare var _paq: any;

@Injectable()
export class ArsnovaClickAngulartics2Piwik extends Angulartics2Piwik {

  constructor(private _angulartics2: Angulartics2, private route: ActivatedRoute) {
    super(_angulartics2);
    this.startTracking();
  }

  public pageTrack(path: string, location?: any): void {
    try {
      _paq.push([
        'setDocumentTitle', (<INamedType>this.getFirstRoutingChild(this.route).component).TYPE,
      ]);
      _paq.push(['setCustomUrl', path]);
      _paq.push(['trackPageView']);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  private getFirstRoutingChild(router: ActivatedRoute): ActivatedRoute {
    return router.children.length ? this.getFirstRoutingChild(router.children[0]) : router;
  }
}
