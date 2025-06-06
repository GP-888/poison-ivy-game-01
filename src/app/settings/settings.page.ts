import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  sound = true;
  vibration = true;
  visual = true;

  constructor(private feedbackService: FeedbackService) {
    this.loadSettings();
  }

  async loadSettings() {
    await this.feedbackService.init();
    this.sound = this.feedbackService['soundEnabled'];
    this.vibration = this.feedbackService['vibrationEnabled'];
    this.visual = this.feedbackService['visualEnabled'];
  }

  updateSettings() {
    this.feedbackService.setFeedbackSettings({
      sound: this.sound,
      vibration: this.vibration,
      visual: this.visual,
    });
  }
}
