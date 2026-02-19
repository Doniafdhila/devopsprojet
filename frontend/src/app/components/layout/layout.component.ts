import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ChildrenOutletContexts } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { routeAnimations } from '../../animations/route-animations';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [routeAnimations]
})
export class LayoutComponent {
  private contexts = inject(ChildrenOutletContexts);
  sidenavOpen = signal(true);

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }

  getRouteAnimationData(): string {
    const ctx = this.contexts.getContext('primary');
    return ctx?.route?.snapshot?.url?.toString() ?? '';
  }
}
