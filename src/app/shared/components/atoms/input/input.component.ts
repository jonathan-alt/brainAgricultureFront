import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="form-group">
      <label *ngIf="label" [for]="id" class="form-label">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [class]="inputClasses"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="form-control"
      />
      <div *ngIf="errorMessage" class="invalid-feedback d-block">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [
    `
      .form-group {
        margin-bottom: var(--spacing-md);
      }

      .form-label {
        font-weight: 500;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
        font-family: "Inter", sans-serif;
        font-size: 0.95rem;
      }

      .form-control {
        width: 100%;
        padding: var(--spacing-md);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: "Inter", sans-serif;
        background: var(--background-white);
        color: var(--text-primary);
      }

      .form-control:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
      }

      .form-control.is-invalid {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(235, 87, 87, 0.1);
      }

      .invalid-feedback {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: var(--spacing-xs);
        font-family: "Inter", sans-serif;
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = "";
  @Input() label = "";
  @Input() type: "text" | "email" | "password" | "number" = "text";
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() errorMessage = "";
  @Input() isInvalid = false;

  value = "";
  touched = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  get inputClasses(): string {
    return this.isInvalid ? "is-invalid" : "";
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    this.value = value || "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
