// tabs.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class TabsPage {

  constructor(private router: Router) {}

  navigateToTab1(): void {
    this.router.navigate(['/tabs/tab1']);
  }
}

