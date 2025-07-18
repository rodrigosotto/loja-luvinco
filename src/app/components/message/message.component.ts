import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  message: any = null;

  constructor(private readonly messageService: MessageService) {
    this.messageService.messages$.subscribe((msg) => {
      this.message = msg;
    });
  }
}
