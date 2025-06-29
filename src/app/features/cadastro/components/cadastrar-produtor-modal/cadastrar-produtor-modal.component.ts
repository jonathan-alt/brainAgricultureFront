import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { cpf } from "cpf-cnpj-validator";
import { CustomValidators } from "../../../../shared/utils/validators";
import { ESTADOS_BRASILEIROS } from "../../../../shared/utils/estados";
import { Fazenda } from "../../../../shared/models/fazenda.model";

@Component({
  selector: "app-cadastrar-produtor-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-plus me-2"></i>Cadastrar Produtor Completo
          </h5>
          <button type="button" class="btn-close" (click)="fecharModal()">
            ×
          </button>
        </div>
        <div class="modal-body">
          <!-- Progress Steps -->
          <div class="progress-steps">
            <div
              class="step"
              [class.active]="etapaAtual === 'produtor'"
              [class.completed]="etapaAtual === 'fazenda'"
            >
              <div class="step-number">1</div>
              <div class="step-label">Produtor</div>
            </div>
            <div
              class="step-line"
              [class.completed]="etapaAtual === 'fazenda'"
            ></div>
            <div
              class="step"
              [class.active]="etapaAtual === 'safra'"
              [class.completed]="etapaAtual === 'safra'"
            >
              <div class="step-number">2</div>
              <div class="step-label">Fazenda</div>
            </div>
            <div
              class="step-line"
              [class.completed]="etapaAtual === 'safra'"
            ></div>
            <div
              class="step"
              [class.active]="etapaAtual === 'safra'"
              [class.completed]="etapaAtual === 'safra'"
            >
              <div class="step-number">3</div>
              <div class="step-label">Safra</div>
            </div>
          </div>

          <!-- Etapa 1: Produtor -->
          <div class="etapa" [class.minimizada]="etapaAtual === 'fazenda'">
            <div
              class="etapa-header"
              (click)="voltarEtapa('produtor')"
              *ngIf="etapaAtual === 'fazenda'"
            >
              <i class="fas fa-chevron-up"></i>
              <span>Produtor: {{ dadosProdutor.nomeprodutor }}</span>
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 'produtor'">
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
                    <div
                      *ngIf="
                        produtorForm.get('nomeprodutor')?.errors?.['required']
                      "
                    >
                      Nome é obrigatório.
                    </div>
                    <div
                      *ngIf="
                        produtorForm.get('nomeprodutor')?.errors?.[
                          'nomeInvalido'
                        ]
                      "
                    >
                      Nome deve ter pelo menos 2 palavras.
                    </div>
                    <div
                      *ngIf="
                        produtorForm.get('nomeprodutor')?.errors?.[
                          'caracteresEspeciais'
                        ]
                      "
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
                    type="button"
                    class="btn btn-success"
                    (click)="finalizarApenasProdutor()"
                    [disabled]="loading"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Finalizar Apenas Produtor" }}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="produtorForm.invalid || loading"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Continuar" }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Etapa 2: Fazenda -->
          <div class="etapa" [class.minimizada]="etapaAtual === 'safra'">
            <div
              class="etapa-header"
              (click)="voltarEtapa('fazenda')"
              *ngIf="etapaAtual === 'safra'"
            >
              <i class="fas fa-chevron-up"></i>
              <span>Fazenda: {{ dadosFazenda.nomefazenda }}</span>
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 'fazenda'">
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
                    <div
                      *ngIf="
                        fazendaForm.get('nomefazenda')?.errors?.['required']
                      "
                    >
                      Nome da fazenda é obrigatório.
                    </div>
                    <div
                      *ngIf="
                        fazendaForm.get('nomefazenda')?.errors?.[
                          'caracteresEspeciais'
                        ]
                      "
                    >
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
                    <div
                      *ngIf="fazendaForm.get('cidade')?.errors?.['required']"
                    >
                      Cidade é obrigatória.
                    </div>
                    <div
                      *ngIf="
                        fazendaForm.get('cidade')?.errors?.[
                          'caracteresEspeciais'
                        ]
                      "
                    >
                      Cidade não pode conter caracteres especiais.
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="estado">Estado</label>
                  <select
                    id="estado"
                    formControlName="estado"
                    [class.is-invalid]="
                      fazendaForm.get('estado')?.touched &&
                      fazendaForm.get('estado')?.invalid
                    "
                  >
                    <option value="">Selecione um estado</option>
                    <option
                      *ngFor="let estado of estados"
                      [value]="estado.sigla"
                    >
                      {{ estado.sigla }} - {{ estado.nome }}
                    </option>
                  </select>
                  <div
                    *ngIf="
                      fazendaForm.get('estado')?.touched &&
                      fazendaForm.get('estado')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    <div
                      *ngIf="fazendaForm.get('estado')?.errors?.['required']"
                    >
                      Estado é obrigatório.
                    </div>
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

                <!-- Lista de Fazendas Adicionadas -->
                <div
                  *ngIf="fazendasAdicionadas.length > 0"
                  class="fazendas-adicionadas"
                >
                  <h6>Fazendas Adicionadas:</h6>
                  <div
                    class="fazenda-item"
                    *ngFor="let fazenda of fazendasAdicionadas; let i = index"
                  >
                    <span class="fazenda-nome">{{ fazenda.nomefazenda }}</span>
                    <span class="fazenda-localizacao"
                      >{{ fazenda.cidade }}, {{ fazenda.estado }}</span
                    >
                    <span class="fazenda-area"
                      >{{ fazenda.areatotalfazenda }} ha</span
                    >
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="voltarEtapa('produtor')"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    class="btn btn-success"
                    (click)="finalizarProdutorFazenda()"
                    [disabled]="!fazendaForm.valid"
                  >
                    Salvar Produtor e Fazenda
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    (click)="adicionarFazenda()"
                    [disabled]="!fazendaForm.valid"
                  >
                    Add + Fazenda
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="fazendaForm.invalid || loading"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Salvar Produtor e Fazenda" }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Etapa 3: Safra -->
          <div class="etapa">
            <div
              class="etapa-header"
              (click)="voltarEtapa('safra')"
              *ngIf="etapaAtual === 'safra'"
            >
              <i class="fas fa-chevron-up"></i>
              <span
                >Safra: {{ dadosSafra.cultura }} - {{ dadosSafra.ano }}</span
              >
            </div>
            <div class="etapa-content" *ngIf="etapaAtual === 'safra'">
              <h6>Dados da Safra</h6>
              <form [formGroup]="safraForm" (ngSubmit)="salvarSafra()">
                <div class="form-row">
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
                      <div
                        *ngIf="safraForm.get('cultura')?.errors?.['required']"
                      >
                        Cultura é obrigatória.
                      </div>
                      <div
                        *ngIf="
                          safraForm.get('cultura')?.errors?.[
                            'caracteresEspeciais'
                          ]
                        "
                      >
                        Cultura não pode conter caracteres especiais.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="nomefazenda">Fazenda</label>
                  <select
                    id="nomefazenda"
                    formControlName="nomefazenda"
                    [class.is-invalid]="
                      safraForm.get('nomefazenda')?.touched &&
                      safraForm.get('nomefazenda')?.invalid
                    "
                  >
                    <option value="">Selecione uma fazenda</option>
                    <option
                      *ngFor="let fazenda of fazendasDisponiveis"
                      [value]="fazenda.nomefazenda"
                    >
                      {{ fazenda.nomefazenda }} - {{ fazenda.cidade }},
                      {{ fazenda.estado }}
                    </option>
                  </select>
                  <div
                    *ngIf="
                      safraForm.get('nomefazenda')?.touched &&
                      safraForm.get('nomefazenda')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    <div
                      *ngIf="safraForm.get('nomefazenda')?.errors?.['required']"
                    >
                      Fazenda é obrigatória.
                    </div>
                  </div>
                </div>

                <!-- Lista de Safras Adicionadas -->
                <div
                  *ngIf="safrasAdicionadas.length > 0"
                  class="safras-adicionadas"
                >
                  <h6>Safras Adicionadas:</h6>
                  <div
                    class="safra-item"
                    *ngFor="let safra of safrasAdicionadas; let i = index"
                  >
                    <span class="safra-cultura">{{ safra.cultura }}</span>
                    <span class="safra-ano">{{ safra.ano }}</span>
                    <span class="safra-fazenda">{{ safra.nomefazenda }}</span>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="voltarEtapa('fazenda')"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    (click)="adicionarSafra()"
                    [disabled]="!safraForm.valid"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Add + Safra" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    (click)="finalizarCompleto()"
                    [disabled]="loading"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Finalizar Completo" }}
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

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
        color: var(--text-primary);
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.25);
      }

      .form-group input.is-invalid,
      .form-group select.is-invalid {
        border-color: var(--error-color);
      }

      .invalid-feedback {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
      }

      .form-actions .btn {
        flex: 1;
        min-width: 140px;
        font-size: 0.9rem;
        padding: 0.6rem 1rem;
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

      .btn-outline-primary {
        background: transparent;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
      }

      .btn-outline-primary:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
      }

      .btn-outline-success {
        background: transparent;
        border: 2px solid var(--success-color);
        color: var(--success-color);
      }

      .btn-outline-success:hover:not(:disabled) {
        background: var(--success-color);
        color: white;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .fazendas-adicionadas,
      .safras-adicionadas {
        margin-top: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      }

      .fazendas-adicionadas h6,
      .safras-adicionadas h6 {
        margin-bottom: 0.75rem;
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.9rem;
      }

      .fazenda-item,
      .safra-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        background: white;
        border-radius: 6px;
        border: 1px solid #e9ecef;
        font-size: 0.875rem;
      }

      .fazenda-item:last-child,
      .safra-item:last-child {
        margin-bottom: 0;
      }

      .fazenda-nome,
      .safra-cultura {
        font-weight: 600;
        color: var(--text-primary);
      }

      .fazenda-localizacao,
      .safra-ano {
        color: #6c757d;
        font-size: 0.8rem;
      }

      .fazenda-area {
        color: var(--primary-color);
        font-weight: 500;
        font-size: 0.8rem;
      }

      .safra-cultura {
        font-weight: 600;
        color: var(--text-primary);
      }

      .safra-ano {
        color: #6c757d;
        font-size: 0.8rem;
      }

      .safra-fazenda {
        color: var(--primary-color);
        font-weight: 500;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class CadastrarProdutorModalComponent implements OnInit {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  produtorForm!: FormGroup;
  fazendaForm!: FormGroup;
  safraForm!: FormGroup;

  etapaAtual: "produtor" | "fazenda" | "safra" = "produtor";
  fazendasAdicionadas: any[] = [];
  safrasAdicionadas: any[] = [];
  fazendasDisponiveis: Fazenda[] = [];
  loading = false;
  dadosProdutor: any = {};
  dadosFazenda: any = {};
  dadosSafra: any = {};
  estados = ESTADOS_BRASILEIROS;

  constructor(private fb: FormBuilder) {
    this.produtorForm = this.fb.group({
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

    this.fazendaForm = this.fb.group(
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

    this.safraForm = this.fb.group({
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2000)],
      ],
      cultura: [
        "",
        [Validators.required, CustomValidators.semCaracteresEspeciaisValidator],
      ],
      nomefazenda: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    // Initialize any additional logic if needed
  }

  fecharModal() {
    this.fechar.emit();
  }

  salvarProdutor() {
    if (this.produtorForm.valid) {
      this.loading = true;
      this.dadosProdutor = this.produtorForm.value;

      // Simular delay de processamento
      setTimeout(() => {
        this.etapaAtual = "fazenda";
        this.loading = false;
      }, 500);
    }
  }

  salvarFazenda() {
    if (this.fazendaForm.valid) {
      this.loading = true;
      this.dadosFazenda = this.fazendaForm.value;

      // Adicionar à lista de fazendas disponíveis para safras
      this.fazendasDisponiveis.push(this.dadosFazenda);

      // Simular delay de processamento
      setTimeout(() => {
        this.etapaAtual = "safra";
        this.loading = false;
      }, 500);
    }
  }

  salvarSafra() {
    if (this.safraForm.valid) {
      this.loading = true;
      this.dadosSafra = this.safraForm.value;

      // Preparar dados para envio com fazendas e safras como arrays
      const dadosParaEnvio: any = {
        produtor: this.dadosProdutor,
        fazendas: [],
        safras: [],
      };

      // Adicionar fazenda principal
      dadosParaEnvio.fazendas.push(this.dadosFazenda);

      // Adicionar fazendas extras se houver
      if (this.fazendasAdicionadas.length > 0) {
        dadosParaEnvio.fazendas.push(...this.fazendasAdicionadas);
      }

      // Adicionar safra principal
      dadosParaEnvio.safras.push(this.dadosSafra);

      // Adicionar safras extras se houver
      if (this.safrasAdicionadas.length > 0) {
        dadosParaEnvio.safras.push(...this.safrasAdicionadas);
      }

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dadosParaEnvio);
        this.loading = false;
        this.fecharModal();
      }, 1500);
    }
  }

  voltarEtapa(etapa: "produtor" | "fazenda" | "safra") {
    this.etapaAtual = etapa;
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

  finalizarApenasProdutor() {
    if (this.produtorForm.valid) {
      this.loading = true;

      const dados = {
        produtor: this.produtorForm.value,
        fazendas: this.fazendasAdicionadas,
        safras: this.safrasAdicionadas,
      };

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dados);
        this.loading = false;
      }, 1500);
    }
  }

  finalizarProdutorFazenda() {
    if (this.fazendaForm.valid) {
      this.loading = true;
      this.dadosFazenda = this.fazendaForm.value;

      // Preparar dados para envio com fazendas como array
      const dadosParaEnvio: any = {
        produtor: this.dadosProdutor,
        fazendas: [],
      };

      // Adicionar fazenda principal
      dadosParaEnvio.fazendas.push(this.dadosFazenda);

      // Adicionar fazendas extras se houver
      if (this.fazendasAdicionadas.length > 0) {
        dadosParaEnvio.fazendas.push(...this.fazendasAdicionadas);
      }

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dadosParaEnvio);
        this.loading = false;
        this.fecharModal();
      }, 1500);
    }
  }

  adicionarFazenda() {
    if (this.fazendaForm.valid) {
      this.loading = true;
      const novaFazenda = this.fazendaForm.value;
      this.fazendasAdicionadas.push(novaFazenda);

      // Adicionar à lista de fazendas disponíveis para safras
      this.fazendasDisponiveis.push(novaFazenda);

      // Limpar formulário para próxima fazenda
      this.fazendaForm.reset();

      // Simular delay de processamento
      setTimeout(() => {
        // Mostrar mensagem de sucesso
        alert(
          `Fazenda "${novaFazenda.nomefazenda}" adicionada! Você pode continuar adicionando mais fazendas ou prosseguir para a safra.`
        );
        // Só finaliza o loading depois do alerta
        this.loading = false;
      }, 500);
    }
  }

  adicionarSafra() {
    if (this.safraForm.valid) {
      this.loading = true;
      const novaSafra = this.safraForm.value;
      this.safrasAdicionadas.push(novaSafra);

      // Limpar formulário para próxima safra
      this.safraForm.reset();
      this.safraForm.patchValue({
        ano: new Date().getFullYear(),
      });

      // Simular delay de processamento
      setTimeout(() => {
        // Mostrar mensagem de sucesso
        alert(
          `Safra "${novaSafra.cultura} - ${novaSafra.ano}" adicionada à fazenda "${novaSafra.nomefazenda}"! Você pode continuar adicionando mais safras ou finalizar o cadastro.`
        );
        // Só finaliza o loading depois do alerta
        this.loading = false;
      }, 500);
    }
  }

  finalizarCompleto() {
    if (this.safraForm.valid) {
      this.loading = true;

      const dados = {
        produtor: this.dadosProdutor,
        fazendas: this.fazendasAdicionadas,
        safras: this.safrasAdicionadas,
      };

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dados);
        this.loading = false;
      }, 1500);
    }
  }
}
