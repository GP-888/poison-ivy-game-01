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
    { id: 1, img: 'assets/images/not_poison_ivy_01.jpg' },
    { id: 2, img: 'assets/images/not_poison_ivy_02.jpg' },
    { id: 3, img: 'assets/images/not_poison_ivy_03.jpg' },
    { id: 4, img: 'assets/images/not_poison_ivy_04.jpg' },
    { id: 5, img: 'assets/images/poison-ivy-1652109_1280.jpg' },
    { id: 6, img: 'assets/images/poison-ivy_pixabay_01.jpg' },
    { id: 7, img: 'assets/images/poisonIvy_640_umdExtension_notForRealGame.jpg' },
    { id: 8, img: 'assets/images/Poison_ivy_01.jpg' },
    { id: 9, img: 'assets/images/Poison_ivy_02.jpg' },
    { id: 10, img: 'assets/images/Poison_ivy_03.jpg' }
  ];

  currentCardIndex = 0;

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    setTimeout(() => this.attachGestureToCurrentCard(), 200);  // wait for DOM + image
    this.cardElements.changes.subscribe(() => {
      setTimeout(() => this.attachGestureToCurrentCard(), 200);
    });
  }

  attachGestureToCurrentCard() {
    const card = this.cardElements.get(this.currentCardIndex)?.nativeElement;
    if (!card) return;

    const img = card.querySelector('img');
    if (img && !img.complete) {
      img.onload = () => this.createGesture(card);
    } else {
      this.createGesture(card);
    }
  }

  createGesture(cardEl: HTMLElement) {
    const gesture = this.gestureCtrl.create({
      el: cardEl,
      gestureName: 'swipe-card',
      threshold: 0,
      canStart: () => true,
      onStart: () => {
        cardEl.style.transition = 'none';
        cardEl.focus?.(); // ensure gesture gets focus in desktop
      },
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
            this.attachGestureToCurrentCard();
          }, 300);

        } else {
          cardEl.style.transition = 'transform 0.3s ease';
          cardEl.style.transform = 'translate(0, 0) rotate(0)';
        }
      },
    });

    gesture.enable(true);
  }
}