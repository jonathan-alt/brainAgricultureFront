import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { CustomValidators } from "../../../../shared/utils/validators";
import { ESTADOS_BRASILEIROS } from "../../../../shared/utils/estados";

@Component({
  selector: "app-fazenda-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="fazenda-form">
      <div class="form-group">
        <label for="nomefazenda">Nome da Fazenda</label>
        <input
          id="nomefazenda"
          type="text"
          formControlName="nomefazenda"
          (blur)="form.get('nomefazenda')?.markAsTouched()"
          [class.is-invalid]="nomeInvalido"
        />
        <div *ngIf="nomeInvalido" class="invalid-feedback">
          <div *ngIf="form.get('nomefazenda')?.errors?.['required']">
            O nome da fazenda é obrigatório.
          </div>
          <div *ngIf="form.get('nomefazenda')?.errors?.['caracteresEspeciais']">
            Nome da fazenda não pode conter caracteres especiais.
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="cidade">Cidade</label>
        <input
          id="cidade"
          type="text"
          formControlName="cidade"
          (blur)="form.get('cidade')?.markAsTouched()"
          [class.is-invalid]="cidadeInvalida"
        />
        <div *ngIf="cidadeInvalida" class="invalid-feedback">
          <div *ngIf="form.get('cidade')?.errors?.['required']">
            A cidade é obrigatória.
          </div>
          <div *ngIf="form.get('cidade')?.errors?.['caracteresEspeciais']">
            Cidade não pode conter caracteres especiais.
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="estado">Estado</label>
        <select
          id="estado"
          formControlName="estado"
          (blur)="form.get('estado')?.markAsTouched()"
          [class.is-invalid]="estadoInvalido"
        >
          <option value="">Selecione um estado</option>
          <option *ngFor="let estado of estados" [value]="estado.sigla">
            {{ estado.sigla }} - {{ estado.nome }}
          </option>
        </select>
        <div *ngIf="estadoInvalido" class="invalid-feedback">
          <div *ngIf="form.get('estado')?.errors?.['required']">
            O estado é obrigatório.
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="areatotalfazenda">Área Total (ha)</label>
        <input
          id="areatotalfazenda"
          type="number"
          formControlName="areatotalfazenda"
          (blur)="form.get('areatotalfazenda')?.markAsTouched()"
          [class.is-invalid]="areaTotalInvalida"
        />
        <div *ngIf="areaTotalInvalida" class="invalid-feedback">
          Área total obrigatória e deve ser maior ou igual à área agricultável.
        </div>
      </div>
      <div class="form-group">
        <label for="areaagricutavel">Área Agricultável (ha)</label>
        <input
          id="areaagricutavel"
          type="number"
          formControlName="areaagricutavel"
          (blur)="form.get('areaagricutavel')?.markAsTouched()"
          [class.is-invalid]="areaAgricultavelInvalida"
        />
        <div *ngIf="areaAgricultavelInvalida" class="invalid-feedback">
          Área agricultável obrigatória e não pode ser maior que a área total.
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-success" [disabled]="!form.valid">
          Salvar Fazenda
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
      .fazenda-form {
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
      input,
      select {
        padding: 0.7rem;
        border-radius: 8px;
        border: 2px solid var(--border-color);
        font-size: 1rem;
        transition: border-color 0.2s;
        background: white;
        color: var(--text-primary);
      }
      input.is-invalid,
      select.is-invalid {
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
export class FazendaFormComponent {
  @Output() salvar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  estados = ESTADOS_BRASILEIROS;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        nomefazenda: [
          "",
          [
            Validators.required,
            CustomValidators.semCaracteresEspeciaisValidator,
          ],
        ],
        cidade: [
          "",
          [
            Validators.required,
            CustomValidators.semCaracteresEspeciaisValidator,
          ],
        ],
        estado: ["", [Validators.required]],
        areatotalfazenda: [null, [Validators.required, Validators.min(0)]],
        areaagricutavel: [null, [Validators.required, Validators.min(0)]],
      },
      { validators: this.areaValidator }
    );
  }

  areaValidator(group: AbstractControl) {
    const total = group.get("areatotalfazenda")?.value;
    const agric = group.get("areaagricutavel")?.value;
    if (total == null || agric == null) return null;
    return Number(total) >= Number(agric) ? null : { areaInvalida: true };
  }

  get nomeInvalido() {
    const c = this.form.get("nomefazenda");
    return c?.touched && c?.invalid;
  }
  get cidadeInvalida() {
    const c = this.form.get("cidade");
    return c?.touched && c?.invalid;
  }
  get estadoInvalido() {
    const c = this.form.get("estado");
    return c?.touched && c?.invalid;
  }
  get areaTotalInvalida() {
    const c = this.form.get("areatotalfazenda");
    return (c?.touched && c?.invalid) || this.form.hasError("areaInvalida");
  }
  get areaAgricultavelInvalida() {
    const c = this.form.get("areaagricutavel");
    return (c?.touched && c?.invalid) || this.form.hasError("areaInvalida");
  }

  onSubmit() {
    if (this.form.valid) {
      this.salvar.emit(this.form.value);
    }
  }
}
