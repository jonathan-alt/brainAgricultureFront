import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { cpf } from "cpf-cnpj-validator";
import { CustomValidators } from "../../../../shared/utils/validators";

@Component({
  selector: "app-produtor-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="produtor-form">
      <div class="form-group">
        <label for="nomeprodutor">Nome do Produtor</label>
        <input
          id="nomeprodutor"
          type="text"
          formControlName="nomeprodutor"
          (blur)="form.get('nomeprodutor')?.markAsTouched()"
          [class.is-invalid]="nomeInvalido"
        />
        <div *ngIf="nomeInvalido" class="invalid-feedback">
          <div *ngIf="form.get('nomeprodutor')?.errors?.['required']">
            Nome é obrigatório.
          </div>
          <div *ngIf="form.get('nomeprodutor')?.errors?.['nomeInvalido']">
            O nome deve conter pelo menos 2 palavras.
          </div>
          <div
            *ngIf="form.get('nomeprodutor')?.errors?.['caracteresEspeciais']"
          >
            Nome não pode conter caracteres especiais.
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="cpf">CPF</label>
        <input
          id="cpf"
          type="text"
          formControlName="cpf"
          (blur)="form.get('cpf')?.markAsTouched()"
          [class.is-invalid]="cpfInvalido"
        />
        <div *ngIf="cpfInvalido" class="invalid-feedback">CPF inválido.</div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-success" [disabled]="!form.valid">
          Salvar Produtor
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
      .produtor-form {
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
export class ProdutorFormComponent {
  @Output() salvar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nomeprodutor: [
        "",
        [
          Validators.required,
          this.nomeValidator,
          CustomValidators.semCaracteresEspeciaisValidator,
        ],
      ],
      cpf: ["", [Validators.required, this.cpfValidator]],
    });
  }

  nomeValidator(control: any) {
    const value = control.value || "";
    return value.trim().split(" ").length >= 2 ? null : { nomeInvalido: true };
  }

  cpfValidator(control: any) {
    const value = control.value || "";
    return cpf.isValid(value) ? null : { cpfInvalido: true };
  }

  get nomeInvalido() {
    const c = this.form.get("nomeprodutor");
    return c?.touched && c?.invalid;
  }

  get cpfInvalido() {
    const c = this.form.get("cpf");
    return c?.touched && c?.invalid;
  }

  onSubmit() {
    if (this.form.valid) {
      this.salvar.emit(this.form.value);
    }
  }
}
