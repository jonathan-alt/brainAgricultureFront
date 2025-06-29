import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "../../atoms/input/input.component";

@Component({
  selector: "app-form-field",
  standalone: true,
  imports: [CommonModule, InputComponent],
  template: `
    <div class="form-field">
      <app-input
        [id]="id"
        [label]="label"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [errorMessage]="errorMessage"
        [isInvalid]="isInvalid"
      ></app-input>
    </div>
  `,
  styles: [
    `
      .form-field {
        margin-bottom: 1.5rem;
      }
    `,
  ],
})
export class FormFieldComponent {
  @Input() id = "";
  @Input() label = "";
  @Input() type: "text" | "email" | "password" | "number" = "text";
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() errorMessage = "";
  @Input() isInvalid = false;
}
