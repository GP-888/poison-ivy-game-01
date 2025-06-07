import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit {
  @ViewChildren('swipeCard', { read: ElementRef })
  cardElements!: QueryList<ElementRef>;

  cards = [
    { id: 1, img: 'assets/images/not_poison_ivy_01.jpg', isPoisonIvy: false },
    { id: 2, img: 'assets/images/not_poison_ivy_02.jpg', isPoisonIvy: false },
    { id: 3, img: 'assets/images/not_poison_ivy_03.jpg', isPoisonIvy: false },
    { id: 4, img: 'assets/images/not_poison_ivy_04.jpg', isPoisonIvy: false },
    { id: 5, img: 'assets/images/poison-ivy-1652109_1280.jpg', isPoisonIvy: true },
    { id: 6, img: 'assets/images/poison-ivy_pixabay_01.jpg', isPoisonIvy: true },
    { id: 7, img: 'assets/images/poisonIvy_640_umdExtension_notForRealGame.jpg', isPoisonIvy: true },
    { id: 8, img: 'assets/images/Poison_ivy_01.jpg', isPoisonIvy: true },
    { id: 9, img: 'assets/images/Poison_ivy_02.jpg', isPoisonIvy: true },
    { id: 10, img: 'assets/images/Poison_ivy_03.jpg', isPoisonIvy: true },
  ];

  currentCardIndex = 0;
  score = 0;
  correctCount = 0;
  incorrectCount = 0;
  lastSwipeCorrect: boolean | null = null;

  // Feedback icon state
  showFeedbackIcon = false;
  feedbackIcon = '';
  feedbackHidden = true;

  private feedbackTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private gestureCtrl: GestureController,
    private feedbackService: FeedbackService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    setTimeout(() => this.attachGestureToCurrentCard(), 200);
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
        cardEl.focus?.();
      },
      onMove: (ev) => {
        const x = ev.deltaX;
        const y = ev.deltaY;
        const rotate = x * 0.1;
        cardEl.style.transition = 'none';
        cardEl.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      },
      onEnd: (ev) => {
        const x = ev.deltaX;
        const threshold = 100;
        const userSwipedRight = x > threshold;
        const userSwipedLeft = x < -threshold;

        if (Math.abs(x) > threshold) {
          const currentCard = this.cards[this.currentCardIndex];
          const isCorrect =
            (userSwipedRight && currentCard.isPoisonIvy) ||
            (userSwipedLeft && !currentCard.isPoisonIvy);

          this.ngZone.run(() => {
            this.updateScores(isCorrect);

            // Set icon and show it
            this.feedbackIcon = isCorrect ? '✓' : '✗';
            this.showFeedbackIcon = true;
            this.feedbackHidden = false;

            // Clear any previous timeout
            if (this.feedbackTimeout) {
              clearTimeout(this.feedbackTimeout);
            }

            // Hide icon after 2 seconds with fade out
            this.feedbackTimeout = setTimeout(() => {
              this.feedbackHidden = true;
              // Hide completely after fade transition (0.5s)
              setTimeout(() => {
                this.showFeedbackIcon = false;
              }, 250);
            }, 250);
          });

          const flyX = userSwipedRight ? 1000 : -1000;
          const rotate = x * 0.2;
          cardEl.style.transition = 'transform 0.3s ease-out';
          cardEl.style.transform = `translate(${flyX}px, 0) rotate(${rotate}deg)`;

          this.feedbackService.giveFeedback(isCorrect, cardEl);

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

  updateScores(isCorrect: boolean) {
    if (isCorrect) {
      this.correctCount++;
      this.score++;
    } else {
      this.incorrectCount++;
      this.score--;
    }
    this.lastSwipeCorrect = isCorrect;
  }
}
