import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "../../../../shared/utils/validators";
import { ESTADOS_BRASILEIROS } from "../../../../shared/utils/estados";

@Component({
  selector: "app-cadastrar-fazenda-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-map-marker-alt me-2"></i>Cadastrar Fazenda Completa
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
              [class.active]="etapaAtual === 'fazenda'"
              [class.completed]="etapaAtual === 'safra'"
            >
              <div class="step-number">1</div>
              <div class="step-label">Fazenda</div>
            </div>
            <div
              class="step-line"
              [class.completed]="etapaAtual === 'safra'"
            ></div>
            <div class="step" [class.active]="etapaAtual === 'safra'">
              <div class="step-number">2</div>
              <div class="step-label">Safra</div>
            </div>
          </div>

          <!-- Etapa 1: Fazenda -->
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
                <div class="form-group">
                  <label for="idprodutor">ID do Produtor</label>
                  <input
                    id="idprodutor"
                    type="number"
                    formControlName="idprodutor"
                    [class.is-invalid]="
                      fazendaForm.get('idprodutor')?.touched &&
                      fazendaForm.get('idprodutor')?.invalid
                    "
                  />
                  <div
                    *ngIf="
                      fazendaForm.get('idprodutor')?.touched &&
                      fazendaForm.get('idprodutor')?.invalid
                    "
                    class="invalid-feedback"
                  >
                    ID do produtor é obrigatório.
                  </div>
                </div>
                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="fazendaForm.invalid || loading"
                  >
                    <span
                      *ngIf="loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ loading ? "Salvando..." : "Salvar Fazenda" }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Etapa 2: Safra -->
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
                      [value]="fazenda"
                    >
                      {{ fazenda }}
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
                </div>
              </form>
            </div>
          </div>

          <div class="etapa-actions">
            <button
              type="button"
              class="btn btn-success"
              (click)="finalizarApenasFazenda()"
              [disabled]="loading"
            >
              <span
                *ngIf="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ loading ? "Salvando..." : "Finalizar Apenas Fazenda" }}
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

      .form-group input:focus {
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

      .etapa-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
      }
    `,
  ],
})
export class CadastrarFazendaModalComponent implements OnInit {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  fazendaForm!: FormGroup;
  safraForm!: FormGroup;

  etapaAtual: "fazenda" | "safra" = "fazenda";
  safrasAdicionadas: any[] = [];
  fazendasDisponiveis: string[] = [];
  loading = false;
  dadosFazenda: any = {};
  dadosSafra: any = {};
  estados = ESTADOS_BRASILEIROS;

  constructor(private fb: FormBuilder) {
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
        idprodutor: [null, [Validators.required, Validators.min(1)]],
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
    // Initialize fazendasDisponiveis with some default values
    this.fazendasDisponiveis = ["Fazenda 1", "Fazenda 2"];
  }

  fecharModal() {
    this.fechar.emit();
  }

  salvarFazenda() {
    if (this.fazendaForm.valid) {
      this.loading = true;
      this.dadosFazenda = this.fazendaForm.value;

      // Adicionar à lista de fazendas disponíveis para safras
      this.fazendasDisponiveis.push(this.dadosFazenda.nomefazenda);

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

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit({
          fazendas: [this.dadosFazenda],
          safras: [this.dadosSafra],
        });
        this.loading = false;
        this.fecharModal();
      }, 1500);
    }
  }

  voltarEtapa(etapa: "fazenda" | "safra") {
    this.etapaAtual = etapa;
  }

  areaValidator(group: any) {
    const total = group.get("areatotalfazenda")?.value;
    const agric = group.get("areaagricutavel")?.value;
    if (total == null || agric == null) return null;
    return Number(total) >= Number(agric) ? null : { areaInvalida: true };
  }

  finalizarApenasFazenda() {
    if (this.fazendaForm.valid) {
      this.loading = true;

      const dados = {
        fazenda: this.fazendaForm.value,
        safras: this.safrasAdicionadas,
      };

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dados);
        this.loading = false;
      }, 1500);
    }
  }

  finalizarCompleto() {
    if (this.fazendaForm.valid && this.safraForm.valid) {
      this.loading = true;

      // Adicionar dados da etapa atual se não foram adicionados ainda
      if (this.etapaAtual === "safra" && this.safraForm.valid) {
        const novaSafra = this.safraForm.value;
        this.safrasAdicionadas.push(novaSafra);
      }

      const dados = {
        fazenda: this.fazendaForm.value,
        safras: this.safrasAdicionadas,
      };

      // Simular delay de salvamento
      setTimeout(() => {
        this.salvar.emit(dados);
        this.loading = false;
      }, 1500);
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
        this.loading = false;
      }, 500);
    }
  }
}
