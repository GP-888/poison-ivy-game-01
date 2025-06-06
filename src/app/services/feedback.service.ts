import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private soundEnabled = true;
  private vibrationEnabled = true;
  private visualEnabled = true;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.soundEnabled = (await this.storage.get('soundEnabled')) ?? true;
    this.vibrationEnabled = (await this.storage.get('vibrationEnabled')) ?? true;
    this.visualEnabled = (await this.storage.get('visualEnabled')) ?? true;
  }

  async setFeedbackSettings({
    sound,
    vibration,
    visual,
  }: {
    sound?: boolean;
    vibration?: boolean;
    visual?: boolean;
  }) {
    if (sound !== undefined) {
      this.soundEnabled = sound;
      await this.storage.set('soundEnabled', sound);
    }
    if (vibration !== undefined) {
      this.vibrationEnabled = vibration;
      await this.storage.set('vibrationEnabled', vibration);
    }
    if (visual !== undefined) {
      this.visualEnabled = visual;
      await this.storage.set('visualEnabled', visual);
    }
  }

  giveFeedback(isCorrect: boolean, element: HTMLElement) {
    if (this.soundEnabled) {
      const audio = new Audio(
        isCorrect ? 'assets/sounds/correct.mp3' : 'assets/sounds/incorrect.mp3'
      );
      audio.play();
    }

    if (this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(isCorrect ? 100 : [100, 100, 100]);
    }

    if (this.visualEnabled) {
      element.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');
      setTimeout(() => {
        element.classList.remove('correct-feedback');
        element.classList.remove('incorrect-feedback');
      }, 300);
    }
  }
}
