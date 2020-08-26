import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  
  @Output()
  public confirmationEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public delete(): void {
    $('.close').click();
    this.confirmationEmitter.emit(true);
  }
}
