import { trigger, transition, style, animate, query } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(15px)' })
    ], { optional: true }),
    query(':leave', [
      animate('150ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 50ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true }),
  ])
]);
