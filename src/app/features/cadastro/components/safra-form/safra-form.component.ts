import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CustomValidators } from "../../../../shared/utils/validators";

@Component({
  selector: "app-safra-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="safra-form">
      <div class="form-group">
        <label for="ano">Ano</label>
        <input
          id="ano"
          type="number"
          formControlName="ano"
          (blur)="form.get('ano')?.markAsTouched()"
          [class.is-invalid]="anoInvalido"
        />
        <div *ngIf="anoInvalido" class="invalid-feedback">
          O ano é obrigatório.
        </div>
      </div>
      <div class="form-group">
        <label for="cultura">Cultura</label>
        <input
          id="cultura"
          type="text"
          formControlName="cultura"
          (blur)="form.get('cultura')?.markAsTouched()"
          [class.is-invalid]="culturaInvalida"
        />
        <div *ngIf="culturaInvalida" class="invalid-feedback">
          <div *ngIf="form.get('cultura')?.errors?.['required']">
            A cultura é obrigatória.
          </div>
          <div *ngIf="form.get('cultura')?.errors?.['caracteresEspeciais']">
            Cultura não pode conter caracteres especiais.
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-success" [disabled]="!form.valid">
          Salvar Safra
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          (click)="cancelar.emit()"
        >
          Cancelar
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .safra-form {
        max-width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      input {
        padding: 0.7rem;
        border-radius: 8px;
        border: 2px solid var(--border-color);
        font-size: 1rem;
        transition: border-color 0.2s;
      }
      input.is-invalid {
        border-color: var(--error-color);
      }
      .invalid-feedback {
        color: var(--error-color);
        font-size: 0.95rem;
        margin-top: 0.2rem;
      }
      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }
      .btn {
        flex: 1;
        font-weight: 600;
        font-size: 1.1rem;
        border-radius: 10px;
        padding: 0.8rem;
      }
    `,
  ],
})
export class SafraFormComponent {
  @Output() salvar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      ano: [null, Validators.required],
      cultura: [
        "",
        [Validators.required, CustomValidators.semCaracteresEspeciaisValidator],
      ],
    });
  }

  get anoInvalido() {
    const c = this.form.get("ano");
    return c?.touched && c?.invalid;
  }
  get culturaInvalida() {
    const c = this.form.get("cultura");
    return c?.touched && c?.invalid;
  }

  onSubmit() {
    if (this.form.valid) {
      this.salvar.emit(this.form.value);
    }
  }
}
