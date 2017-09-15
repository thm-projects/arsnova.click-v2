import {Component, OnInit, Renderer2} from '@angular/core';
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {ThemesService} from "../../service/themes.service";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor(private footerBarService:FooterBarService,
              private headerLabelService: HeaderLabelService,
              private themesService: ThemesService) {
    themesService.updateCurrentlyUsedTheme();
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
