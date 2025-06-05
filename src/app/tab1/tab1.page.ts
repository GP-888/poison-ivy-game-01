import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { GestureController, Gesture } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit {
  @ViewChildren('swipeCard', { read: ElementRef }) cardElements!: QueryList<ElementRef>;

  cards = [
    { id: 1, img: 'assets/img1.jpg' },
    { id: 2, img: 'assets/img2.jpg' },
    { id: 3, img: 'assets/img3.jpg' },
    { id: 4, img: 'assets/img4.jpg' }
  ];

  currentCardIndex = 0;
  private currentGesture?: Gesture;

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    this.cardElements.changes.subscribe(() => {
      this.bindGesture();
    });
    this.bindGesture();
  }

  bindGesture() {
    this.currentGesture?.destroy(); // clean up old gesture
    const cardEl = this.cardElements.get(this.currentCardIndex)?.nativeElement;
    if (!cardEl) return;

    const gesture = this.gestureCtrl.create({
      el: cardEl,
      gestureName: 'swipe-card',
      threshold: 0,
      onMove: ev => {
        const x = ev.deltaX;
        const y = ev.deltaY;
        const rotate = x * 0.1;
        cardEl.style.transition = 'none';
        cardEl.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      },
      onEnd: ev => {
        const x = ev.deltaX;
        const threshold = 100;
        if (Math.abs(x) > threshold) {
          const flyX = x > 0 ? 1000 : -1000;
          const rotate = x * 0.2;
          cardEl.style.transition = 'transform 0.3s ease-out';
          cardEl.style.transform = `translate(${flyX}px, 0) rotate(${rotate}deg)`;
          setTimeout(() => {
            this.currentCardIndex++;
            this.bindGesture();
          }, 300);
        } else {
          cardEl.style.transition = 'transform 0.3s ease';
          cardEl.style.transform = 'translate(0, 0) rotate(0)';
        }
      },
    });

    gesture.enable(true);
    this.currentGesture = gesture;
  }
}