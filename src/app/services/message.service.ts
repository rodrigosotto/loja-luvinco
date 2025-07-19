import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageSubject = new BehaviorSubject<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  messages$ = this.messageSubject.asObservable();

  showSuccess(text: string) {
    this.messageSubject.next({ text, type: 'success' });
    setTimeout(() => this.clearMessage(), 3000);
  }

  showError(text: string) {
    this.messageSubject.next({ text, type: 'error' });
    setTimeout(() => this.clearMessage(), 5000);
  }

  clearMessage() {
    this.messageSubject.next(null);
  }
}
