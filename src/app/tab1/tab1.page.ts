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

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    const gesture: Gesture = this.gestureCtrl.create({
      el: this.swipeCard.nativeElement,
      gestureName: 'swipe',
      threshold: 10,
      onStart: () => {
        this.swipeCard.nativeElement.style.transition = 'none';
      },
      onMove: ev => {
        this.swipeCard.nativeElement.style.transform = `translateX(${ev.deltaX}px)`;
      },
      onEnd: ev => {
        this.swipeCard.nativeElement.style.transition = 'transform 0.3s ease';
        if (ev.deltaX > 150) {
          console.log('Swiped right');
          this.swipeCard.nativeElement.style.transform = 'translateX(1000px)';
        } else if (ev.deltaX < -150) {
          console.log('Swiped left');
          this.swipeCard.nativeElement.style.transform = 'translateX(-1000px)';
        } else {
          this.swipeCard.nativeElement.style.transform = 'translateX(0)';
        }
      }
    });

    gesture.enable(true);
  }
}