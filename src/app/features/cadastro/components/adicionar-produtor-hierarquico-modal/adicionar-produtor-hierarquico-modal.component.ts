import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { cpf } from "cpf-cnpj-validator";

@Component({
  selector: "app-adicionar-produtor-hierarquico-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-plus me-2"></i>Adicionar Produtor Completo
          </h5>
          <button
            type="button"
            class="btn-close"
            (click)="fecharModal()"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Progress Steps -->
          <div class="progress-steps">
            <div
              class="step"
              [class.active]="etapaAtual >= 1"
              [class.completed]="etapaAtual > 1"
            >
              <div class="step-number">1</div>
              <div class="step-label">Produtor</div>
            </div>
            <div class="step-line" [class.completed]="etapaAtual > 1"></div>
            <div
              class="step"
              [class.active]="etapaAtual >= 2"
              [class.completed]="etapaAtual > 2"
            >
              <div class="step-number">2</div>
              <div class="step-label">Fazenda</div>
            </div>
            <div class="step-line" [class.completed]="etapaAtual > 2"></div>
            <div
              class="step"
              [class.active]="etapaAtual >= 3"
              [class.completed]="etapaAtual > 3"
            >
              <div class="step-number">3</div>
              <div class="step-label">Safra</div>
            </div>
          </div>

          <!-- Etapa 1: Produtor -->
          <div class="etapa" [class.minimizada]="etapaAtual > 1">
            <div
              class="etapa-header"
              (click)="voltarEtapa(1)"
              *ngIf="etapaAtual > 1"
            >
              <i class="fas fa-chevron-up"></i>
              <span>Produtor: {{ dadosProdutor.nomeprodutor }}</span>
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 1">
              <h6>Dados do Produtor</h6>
              <form [formGroup]="produtorForm" (ngSubmit)="salvarProdutor()">
                <div class="form-group">
                  <label for="nomeprodutor">Nome do Produtor</label>
                  <input
                    id="nomeprodutor"
                    type="text"
                    formControlName="nomeprodutor"
                    [class.is-invalid]="
                      produtorForm.get('nomeprodutor')?.touched &&
                      produtorForm.get('nomeprodutor')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      produtorForm.get('nomeprodutor')?.touched &&
                      produtorForm.get('nomeprodutor')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Nome é obrigatório e deve ter pelo menos 2 palavras.
                  </div>
                </div>
                <div class="form-group">
                  <label for="cpf">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    formControlName="cpf"
                    [class.is-invalid]="
                      produtorForm.get('cpf')?.touched &&
                      produtorForm.get('cpf')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      produtorForm.get('cpf')?.touched &&
                      produtorForm.get('cpf')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    CPF inválido.
                  </div>
                </div>
                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="!produtorForm.valid"
                  >
                    Continuar para Fazenda
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Etapa 2: Fazenda -->
          <div class="etapa" [class.minimizada]="etapaAtual > 2">
            <div
              class="etapa-header"
              (click)="voltarEtapa(2)"
              *ngIf="etapaAtual > 2"
            >
              <i class="fas fa-chevron-up"></i>
              <span>Fazenda: {{ dadosFazenda.nomefazenda }}</span>
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 2">
              <h6>Dados da Fazenda</h6>
              <form [formGroup]="fazendaForm" (ngSubmit)="salvarFazenda()">
                <div class="form-group">
                  <label for="nomefazenda">Nome da Fazenda</label>
                  <input
                    id="nomefazenda"
                    type="text"
                    formControlName="nomefazenda"
                    [class.is-invalid]="
                      fazendaForm.get('nomefazenda')?.touched &&
                      fazendaForm.get('nomefazenda')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      fazendaForm.get('nomefazenda')?.touched &&
                      fazendaForm.get('nomefazenda')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Nome da fazenda é obrigatório.
                  </div>
                </div>
                <div class="form-group">
                  <label for="cidade">Cidade</label>
                  <input
                    id="cidade"
                    type="text"
                    formControlName="cidade"
                    [class.is-invalid]="
                      fazendaForm.get('cidade')?.touched &&
                      fazendaForm.get('cidade')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      fazendaForm.get('cidade')?.touched &&
                      fazendaForm.get('cidade')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Cidade é obrigatória.
                  </div>
                </div>
                <div class="form-group">
                  <label for="estado">Estado</label>
                  <input
                    id="estado"
                    type="text"
                    formControlName="estado"
                    [class.is-invalid]="
                      fazendaForm.get('estado')?.touched &&
                      fazendaForm.get('estado')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      fazendaForm.get('estado')?.touched &&
                      fazendaForm.get('estado')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Estado é obrigatório.
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="areatotalfazenda">Área Total (ha)</label>
                    <input
                      id="areatotalfazenda"
                      type="number"
                      formControlName="areatotalfazenda"
                      [class.is-invalid]="
                        fazendaForm.get('areatotalfazenda')?.touched &&
                        fazendaForm.get('areatotalfazenda')?.invalid
                      "
                    />
                  </div>
                  <div class="form-group">
                    <label for="areaagricutavel">Área Agricultável (ha)</label>
                    <input
                      id="areaagricutavel"
                      type="number"
                      formControlName="areaagricutavel"
                      [class.is-invalid]="
                        fazendaForm.get('areaagricutavel')?.touched &&
                        fazendaForm.get('areaagricutavel')?.invalid
                      "
                    />
                  </div>
                </div>
                <div
                  *ngIf="fazendaForm.hasError('areaInvalida')"
                  class="invalid-feedback d-block"
                >
                  Área agricultável não pode ser maior que a área total.
                </div>
                <div class="form-actions">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="voltarEtapa(1)"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="!fazendaForm.valid"
                  >
                    Continuar para Safra
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Etapa 3: Safra -->
          <div class="etapa">
            <div
              class="etapa-header"
              (click)="voltarEtapa(3)"
              *ngIf="etapaAtual > 3"
            >
              <i class="fas fa-chevron-up"></i>
              <span
                >Safra: {{ dadosSafra.cultura }} - {{ dadosSafra.ano }}</span
              >
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 3">
              <h6>Dados da Safra</h6>
              <form [formGroup]="safraForm" (ngSubmit)="salvarSafra()">
                <div class="form-group">
                  <label for="ano">Ano da Safra</label>
                  <input
                    id="ano"
                    type="number"
                    formControlName="ano"
                    [class.is-invalid]="
                      safraForm.get('ano')?.touched &&
                      safraForm.get('ano')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      safraForm.get('ano')?.touched &&
                      safraForm.get('ano')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Ano é obrigatório.
                  </div>
                </div>
                <div class="form-group">
                  <label for="cultura">Cultura</label>
                  <input
                    id="cultura"
                    type="text"
                    formControlName="cultura"
                    [class.is-invalid]="
                      safraForm.get('cultura')?.touched &&
                      safraForm.get('cultura')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      safraForm.get('cultura')?.touched &&
                      safraForm.get('cultura')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    Cultura é obrigatória.
                  </div>
                </div>
                <div class="form-actions">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="voltarEtapa(2)"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    [disabled]="!safraForm.valid"
                  >
                    Finalizar Cadastro
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-title {
        margin: 0;
        font-weight: 600;
        color: var(--primary-color);
      }

      .modal-body {
        padding: 1.5rem;
        max-height: 70vh;
        overflow-y: auto;
      }

      .progress-steps {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        gap: 0.5rem;
      }

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e9ecef;
        color: #6c757d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .step.active .step-number {
        background: var(--primary-color);
        color: white;
      }

      .step.completed .step-number {
        background: var(--success-color);
        color: white;
      }

      .step-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #6c757d;
      }

      .step.active .step-label {
        color: var(--primary-color);
      }

      .step.completed .step-label {
        color: var(--success-color);
      }

      .step-line {
        width: 40px;
        height: 2px;
        background: #e9ecef;
        transition: all 0.3s ease;
      }

      .step-line.completed {
        background: var(--success-color);
      }

      .etapa {
        margin-bottom: 1.5rem;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .etapa.minimizada {
        max-height: 60px;
      }

      .etapa-header {
        padding: 1rem;
        background: #f8f9fa;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        color: var(--primary-color);
      }

      .etapa-header:hover {
        background: #e9ecef;
      }

      .etapa-content {
        padding: 1.5rem;
      }

      .etapa-content h6 {
        margin-bottom: 1rem;
        color: var(--primary-color);
        font-weight: 600;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
      }

      .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.25);
      }

      .form-group input.is-invalid {
        border-color: var(--error-color);
      }

      .invalid-feedback {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: var(--primary-color);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #2e7d32;
      }

      .btn-secondary {
        background: var(--secondary-color);
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #e2b93b;
      }

      .btn-success {
        background: var(--success-color);
        color: white;
      }

      .btn-success:hover:not(:disabled) {
        background: #2e7d32;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.5;
      }

      .btn-close:hover {
        opacity: 1;
      }
    `,
  ],
})
export class AdicionarProdutorHierarquicoModalComponent {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  etapaAtual = 1;
  dadosProdutor: any = {};
  dadosFazenda: any = {};
  dadosSafra: any = {};

  produtorForm: FormGroup;
  fazendaForm: FormGroup;
  safraForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.produtorForm = this.fb.group({
      nomeprodutor: ["", [Validators.required, this.nomeValidator]],
      cpf: ["", [Validators.required, this.cpfValidator]],
    });

    this.fazendaForm = this.fb.group(
      {
        nomefazenda: ["", Validators.required],
        cidade: ["", Validators.required],
        estado: ["", Validators.required],
        areatotalfazenda: [null, [Validators.required, Validators.min(0)]],
        areaagricutavel: [null, [Validators.required, Validators.min(0)]],
      },
      { validators: this.areaValidator }
    );

    this.safraForm = this.fb.group({
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2000)],
      ],
      cultura: ["", Validators.required],
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

  areaValidator(group: any) {
    const total = group.get("areatotalfazenda")?.value;
    const agric = group.get("areaagricutavel")?.value;
    if (total == null || agric == null) return null;
    return Number(total) >= Number(agric) ? null : { areaInvalida: true };
  }

  salvarProdutor() {
    if (this.produtorForm.valid) {
      this.dadosProdutor = this.produtorForm.value;
      this.etapaAtual = 2;
    }
  }

  salvarFazenda() {
    if (this.fazendaForm.valid) {
      this.dadosFazenda = this.fazendaForm.value;
      this.etapaAtual = 3;
    }
  }

  salvarSafra() {
    if (this.safraForm.valid) {
      this.dadosSafra = this.safraForm.value;
      this.finalizarCadastro();
    }
  }

  finalizarCadastro() {
    const dadosCompletos = {
      produtor: this.dadosProdutor,
      fazenda: this.dadosFazenda,
      safra: this.dadosSafra,
    };
    this.salvar.emit(dadosCompletos);
    this.fecharModal();
  }

  voltarEtapa(etapa: number) {
    this.etapaAtual = etapa;
  }

  fecharModal() {
    this.fechar.emit();
  }
}
