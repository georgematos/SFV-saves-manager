import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

  @Output()
  public languageEmitted = new EventEmitter();

  public selectLang(lang: string) {
    this.languageEmitted.emit(lang)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
