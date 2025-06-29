import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div *ngIf="title" class="card-header">
        <h5 class="card-title mb-0">{{ title }}</h5>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: var(--background-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-card);
        border: 1px solid var(--border-light);
        transition: all 0.3s ease;
        font-family: "Inter", sans-serif;
      }

      .card:hover {
        box-shadow: var(--shadow-medium);
        transform: translateY(-2px);
      }

      .card-header {
        background: transparent;
        border-bottom: 1px solid var(--border-color);
        padding: var(--spacing-md) var(--spacing-lg);
      }

      .card-title {
        color: var(--text-primary);
        font-weight: 600;
        font-size: 1.25rem;
        margin: 0;
      }

      .card-body {
        padding: var(--spacing-lg);
      }

      .card-compact .card-body {
        padding: var(--spacing-md);
      }
    `,
  ],
})
export class CardComponent {
  @Input() title = "";
  @Input() compact = false;

  get cardClasses(): string {
    return `card ${this.compact ? "card-compact" : ""}`;
  }
}
