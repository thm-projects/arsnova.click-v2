import {Component, OnInit, Renderer2} from '@angular/core';
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {DefaultSettings} from "../../service/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor(private footerBarService:FooterBarService, private renderer: Renderer2, private headerLabelService: HeaderLabelService) {
    if (window.sessionStorage.getItem('quizTheme')) {
      this.renderer.addClass(document.body, window.sessionStorage.getItem('quizTheme'));
    } else {
      if (!window.localStorage.getItem('defaultTheme')) {
        window.localStorage.setItem('defaultTheme', DefaultSettings.defaultSettings.theme);
      }
      this.renderer.addClass(document.body, window.localStorage.getItem('defaultTheme'));
    }
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
