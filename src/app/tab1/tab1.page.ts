import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements AfterViewInit {
  @ViewChild('swipeCard', { read: ElementRef }) swipeCard!: ElementRef;

  private dismissed = false;

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    const card = this.swipeCard.nativeElement;

    const gesture: Gesture = this.gestureCtrl.create({
      el: card,
      gestureName: 'swipe',
      onStart: () => {
        this.dismissed = false;
        card.style.transition = 'none';
      },
      onMove: ev => {
        if (this.dismissed) return;

        const rotate = ev.deltaX / 20;
        card.style.transform = `translateX(${ev.deltaX}px) rotate(${rotate}deg)`;

        if (Math.abs(ev.deltaX) > 150) {
          this.dismissed = true;
          const direction = ev.deltaX > 0 ? 1000 : -1000;
          const rotateOut = direction / 20;
          card.style.transition = 'transform 0.3s ease';
          card.style.transform = `translateX(${direction}px) rotate(${rotateOut}deg)`;
          card.style.pointerEvents = 'none';

          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      },
      onEnd: () => {
        if (!this.dismissed) {
          card.style.transition = 'transform 0.3s ease';
          card.style.transform = 'translateX(0) rotate(0)';
        }
      }
    });

    gesture.enable(true);
  }
}