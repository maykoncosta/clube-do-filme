import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  showMessage(message: Message) {
    this.messageSubject.next(message);
  }

  success(text: string, duration = 5000) {
    this.showMessage({ text, type: 'success', duration });
  }

  error(text: string, duration = 5000) {
    this.showMessage({ text, type: 'error', duration });
  }

  info(text: string, duration = 5000) {
    this.showMessage({ text, type: 'info', duration });
  }
}
