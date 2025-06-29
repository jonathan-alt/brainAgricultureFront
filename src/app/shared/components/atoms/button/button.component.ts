import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <i *ngIf="icon" [class]="icon" [class]="iconClass"></i>
      <span
        *ngIf="loading"
        class="spinner-border spinner-border-sm me-2"
        role="status"
      ></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        border: none;
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        min-width: 120px;
        box-shadow: var(--shadow-light);
        font-family: "Inter", sans-serif;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }

      .btn-primary {
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: linear-gradient(
          135deg,
          var(--primary-dark),
          var(--primary-color)
        );
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
      }

      .btn-secondary {
        background: var(--accent-color);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
      }

      .btn-secondary:hover:not(:disabled) {
        background: var(--border-color);
        color: var(--text-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
      }

      .btn-success {
        background: linear-gradient(135deg, var(--success-color), #4caf50);
        color: white;
      }

      .btn-success:hover:not(:disabled) {
        background: linear-gradient(135deg, #219653, var(--success-color));
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
      }

      .btn-danger {
        background: linear-gradient(135deg, var(--error-color), #f44336);
        color: white;
      }

      .btn-danger:hover:not(:disabled) {
        background: linear-gradient(135deg, #d32f2f, var(--error-color));
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
      }

      .btn-outline {
        background: transparent;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
      }

      .btn-outline:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
      }

      .btn-sm {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: 0.875rem;
        min-width: 100px;
      }

      .btn-lg {
        padding: var(--spacing-lg) var(--spacing-xl);
        font-size: 1.125rem;
        min-width: 140px;
      }

      .btn-block {
        width: 100%;
      }

      .spinner-border {
        width: 1rem;
        height: 1rem;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() variant: "primary" | "secondary" | "success" | "danger" | "outline" =
    "primary";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() icon = "";
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = [`btn-${this.variant}`];

    if (this.size !== "md") {
      classes.push(`btn-${this.size}`);
    }

    if (this.block) {
      classes.push("btn-block");
    }

    return classes.join(" ");
  }

  get iconClass(): string {
    return this.icon ? "me-2" : "";
  }
}
