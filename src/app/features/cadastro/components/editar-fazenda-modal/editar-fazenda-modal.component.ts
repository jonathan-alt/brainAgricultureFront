import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FazendaService } from "../../../../shared/services/fazenda.service";
import { ProdutorService } from "../../../../shared/services/produtor.service";
import { SafraService } from "../../../../shared/services/safra.service";
import {
  Fazenda,
  FazendaCreate,
  Produtor,
  Safra,
  SafraCreate,
} from "../../../../shared/models";
import { CustomValidators } from "../../../../shared/utils/validators";
import { ESTADOS_BRASILEIROS } from "../../../../shared/utils/estados";

@Component({
  selector: "app-editar-fazenda-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-edit me-2"></i>Editar Fazendas
          </h5>
          <button type="button" class="btn-close" (click)="fecharModal()">
            ×
          </button>
        </div>

        <div class="modal-body">
          <!-- Busca -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar fazenda por nome..."
                [(ngModel)]="termoBusca"
                (input)="filtrarFazendas()"
              />
            </div>
          </div>

          <!-- Lista de Fazendas -->
          <div class="fazendas-lista">
            <div
              *ngFor="let fazenda of fazendasFiltradas"
              class="fazenda-item"
              [class.selected]="fazendaSelecionada?.id === fazenda.id"
              (click)="selecionarFazenda(fazenda)"
            >
              <div class="fazenda-info">
                <h6 class="fazenda-nome">{{ fazenda.nomefazenda }}</h6>
              </div>
              <div class="fazenda-acoes">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editarFazenda(fazenda)"
                  [disabled]="loadingEditar"
                >
                  <span
                    *ngIf="loadingEditar"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-success"
                  (click)="gerenciarSafras(fazenda)"
                  title="Gerenciar Safras"
                >
                  <i class="fas fa-seedling"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  (click)="excluirFazenda(fazenda)"
                  [disabled]="loadingExcluir"
                >
                  <span
                    *ngIf="loadingExcluir"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div
              *ngIf="fazendasFiltradas.length === 0"
              class="text-center py-4"
            >
              <i class="fas fa-search fa-2x text-muted mb-2"></i>
              <p class="text-muted">Nenhuma fazenda encontrada</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div
      *ngIf="mostrarModalEdicao"
      class="modal-overlay"
      (click)="fecharModalEdicao()"
    >
      <div
        class="modal-content modal-edicao"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-edit me-2"></i>Editar Fazenda
          </h5>
          <button type="button" class="btn-close" (click)="fecharModalEdicao()">
            ×
          </button>
        </div>

        <div class="modal-body">
          <form [formGroup]="fazendaForm" (ngSubmit)="salvarEdicao()">
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
                  *ngIf="fazendaForm.get('nomefazenda')?.errors?.['required']"
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
                <div *ngIf="fazendaForm.get('cidade')?.errors?.['required']">
                  Cidade é obrigatória.
                </div>
                <div
                  *ngIf="
                    fazendaForm.get('cidade')?.errors?.['caracteresEspeciais']
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
                <option *ngFor="let estado of estados" [value]="estado.sigla">
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
                <div *ngIf="fazendaForm.get('estado')?.errors?.['required']">
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
                <div
                  *ngIf="
                    fazendaForm.get('areatotalfazenda')?.touched &&
                    fazendaForm.get('areatotalfazenda')?.invalid
                  "
                  class="invalid-feedback"
                >
                  <div
                    *ngIf="
                      fazendaForm.get('areatotalfazenda')?.errors?.['required']
                    "
                  >
                    Área total é obrigatória.
                  </div>
                  <div
                    *ngIf="fazendaForm.get('areatotalfazenda')?.errors?.['min']"
                  >
                    Área total deve ser maior que 0.
                  </div>
                </div>
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
                <div
                  *ngIf="
                    fazendaForm.get('areaagricutavel')?.touched &&
                    fazendaForm.get('areaagricutavel')?.invalid
                  "
                  class="invalid-feedback"
                >
                  <div
                    *ngIf="
                      fazendaForm.get('areaagricutavel')?.errors?.['required']
                    "
                  >
                    Área agricultável é obrigatória.
                  </div>
                  <div
                    *ngIf="fazendaForm.get('areaagricutavel')?.errors?.['min']"
                  >
                    Área agricultável deve ser maior que 0.
                  </div>
                </div>
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
                (click)="fecharModalEdicao()"
              >
                Cancelar
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
                {{ loading ? "Salvando..." : "Salvar Alterações" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Gerenciamento de Safras -->
    <div
      *ngIf="mostrarModalSafras"
      class="modal-overlay"
      (click)="fecharModalSafras()"
    >
      <div
        class="modal-content modal-safras"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-seedling me-2"></i>Gerenciar Safras -
            {{ fazendaSelecionada?.nomefazenda }}
          </h5>
          <button type="button" class="btn-close" (click)="fecharModalSafras()">
            ×
          </button>
        </div>

        <div class="modal-body">
          <!-- Busca de Safras -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar safra por cultura ou ano..."
                [(ngModel)]="termoBuscaSafras"
                (input)="filtrarSafras()"
              />
            </div>
          </div>

          <!-- Lista de Safras -->
          <div class="safras-lista">
            <div
              *ngFor="let safra of safrasFiltradas"
              class="safra-item"
              [class.selected]="safraSelecionada?.id === safra.id"
              (click)="selecionarSafra(safra)"
            >
              <div class="safra-info">
                <h6 class="safra-cultura">{{ safra.cultura }}</h6>
                <p class="safra-ano">{{ safra.ano }}</p>
              </div>
              <div class="safra-acoes">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editarSafra(safra)"
                  title="Editar Safra"
                  [disabled]="loadingEditarSafra"
                >
                  <span
                    *ngIf="loadingEditarSafra"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  (click)="excluirSafra(safra)"
                  title="Excluir Safra"
                  [disabled]="loadingExcluirSafra"
                >
                  <span
                    *ngIf="loadingExcluirSafra"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div *ngIf="safrasFiltradas.length === 0" class="text-center py-4">
              <i class="fas fa-seedling fa-2x text-muted mb-2"></i>
              <p class="text-muted">Nenhuma safra encontrada</p>
            </div>
          </div>

          <!-- Botão Adicionar Nova Safra -->
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-success w-100"
              (click)="adicionarNovaSafra()"
            >
              <i class="fas fa-plus me-2"></i>Adicionar Nova Safra
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição/Adição de Safra -->
    <div
      *ngIf="mostrarModalEdicaoSafra"
      class="modal-overlay"
      (click)="fecharModalEdicaoSafra()"
    >
      <div
        class="modal-content modal-edicao"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-edit me-2"></i
            >{{ editandoSafra ? "Editar" : "Adicionar" }} Safra
          </h5>
          <button
            type="button"
            class="btn-close"
            (click)="fecharModalEdicaoSafra()"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
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
                  <div *ngIf="safraForm.get('ano')?.errors?.['required']">
                    Ano é obrigatório.
                  </div>
                  <div *ngIf="safraForm.get('ano')?.errors?.['min']">
                    Ano deve ser maior que 2000.
                  </div>
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
                  <div *ngIf="safraForm.get('cultura')?.errors?.['required']">
                    Cultura é obrigatória.
                  </div>
                  <div
                    *ngIf="
                      safraForm.get('cultura')?.errors?.['caracteresEspeciais']
                    "
                  >
                    Cultura não pode conter caracteres especiais.
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="fecharModalEdicaoSafra()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="safraForm.invalid || loading"
              >
                <span
                  *ngIf="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{
                  loading
                    ? "Salvando..."
                    : editandoSafra
                      ? "Salvar Alterações"
                      : "Adicionar Safra"
                }}
              </button>
            </div>
          </form>
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
        max-width: 700px;
        max-height: 80vh;
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
        max-height: 60vh;
        overflow-y: auto;
      }

      .fazendas-lista {
        max-height: 400px;
        overflow-y: auto;
      }

      .fazenda-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .fazenda-item:hover {
        background: #f8f9fa;
        border-color: var(--primary-color);
      }

      .fazenda-item.selected {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .fazenda-info {
        flex: 1;
      }

      .fazenda-nome {
        margin: 0;
        font-weight: 600;
        font-size: 1rem;
      }

      .fazenda-localizacao {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .fazenda-area {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.7;
      }

      .fazenda-acoes {
        display: flex;
        gap: 0.5rem;
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

      .btn {
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-outline-primary {
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
      }

      .btn-outline-primary:hover {
        background: #007bff;
        color: white;
      }

      .btn-outline-danger {
        background: transparent;
        border: 1px solid var(--error-color);
        color: var(--error-color);
      }

      .btn-outline-danger:hover {
        background: var(--error-color);
        color: white;
      }

      .btn-secondary {
        background: var(--secondary-color);
        color: white;
      }

      .btn-secondary:hover {
        background: #e2b93b;
      }

      .modal-edicao {
        max-width: 600px;
      }

      .form-group {
        margin-bottom: 1rem;
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
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
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

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
      }

      .modal-safras {
        max-width: 700px;
      }

      .safras-lista {
        max-height: 400px;
        overflow-y: auto;
      }

      .safra-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .safra-item:hover {
        background: #f8f9fa;
        border-color: var(--primary-color);
      }

      .safra-item.selected {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .safra-info {
        flex: 1;
      }

      .safra-cultura {
        margin: 0;
        font-weight: 600;
        font-size: 1rem;
      }

      .safra-ano {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .safra-acoes {
        display: flex;
        gap: 0.5rem;
      }

      .btn-outline-success {
        background: transparent;
        border: 1px solid var(--success-color);
        color: var(--success-color);
      }

      .btn-outline-success:hover {
        background: var(--success-color);
        color: white;
      }
    `,
  ],
})
export class EditarFazendaModalComponent {
  @Output() fechar = new EventEmitter<void>();

  fazendas: Fazenda[] = [];
  fazendasFiltradas: Fazenda[] = [];
  fazendaSelecionada: Fazenda | null = null;
  termoBusca = "";
  mostrarModalEdicao = false;
  fazendaForm: FormGroup;
  loading = false;
  loadingEditar = false;
  loadingExcluir = false;
  estados = ESTADOS_BRASILEIROS;
  mostrarModalSafras = false;
  termoBuscaSafras = "";
  safrasFiltradas: Safra[] = [];
  safraSelecionada: Safra | null = null;
  editandoSafra = false;
  mostrarModalEdicaoSafra = false;
  safraForm: FormGroup;
  loadingEditarSafra = false;
  loadingExcluirSafra = false;

  constructor(
    private fazendaService: FazendaService,
    private produtorService: ProdutorService,
    private safraService: SafraService,
    private store: Store,
    private formBuilder: FormBuilder
  ) {
    this.fazendaForm = this.formBuilder.group(
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
        estado: ["", Validators.required],
        areatotalfazenda: ["", [Validators.required, Validators.min(0)]],
        areaagricutavel: ["", [Validators.required, Validators.min(0)]],
      },
      { validators: this.areaValidator }
    );
    this.safraForm = this.formBuilder.group({
      ano: ["", [Validators.required, Validators.min(2000)]],
      cultura: [
        "",
        [Validators.required, CustomValidators.semCaracteresEspeciaisValidator],
      ],
    });
    this.carregarFazendas();
  }

  carregarFazendas() {
    console.log("Carregando fazendas...");
    this.fazendaService.getAllFazendas().subscribe({
      next: (fazendas) => {
        console.log("Fazendas carregadas:", fazendas);
        this.fazendas = fazendas;
        this.fazendasFiltradas = fazendas;
      },
      error: (error) => {
        console.error("Erro ao carregar fazendas:", error);
      },
    });
  }

  filtrarFazendas() {
    if (!this.termoBusca.trim()) {
      this.fazendasFiltradas = this.fazendas;
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.fazendasFiltradas = this.fazendas.filter((fazenda) =>
        fazenda.nomefazenda.toLowerCase().includes(termo)
      );
    }
  }

  selecionarFazenda(fazenda: Fazenda) {
    this.fazendaSelecionada = fazenda;
  }

  editarFazenda(fazenda: Fazenda) {
    this.loadingEditar = true;
    this.fazendaSelecionada = fazenda;

    // Simular delay de carregamento dos dados
    setTimeout(() => {
      this.fazendaForm.patchValue({
        nomefazenda: fazenda.nomefazenda,
        cidade: fazenda.cidade,
        estado: fazenda.estado,
        areatotalfazenda: fazenda.areatotalfazenda,
        areaagricutavel: fazenda.areaagricutavel,
      });
      this.mostrarModalEdicao = true;
      this.loadingEditar = false;
    }, 300);
  }

  excluirFazenda(fazenda: Fazenda) {
    if (
      confirm(
        `Tem certeza que deseja excluir a fazenda "${fazenda.nomefazenda}"?`
      )
    ) {
      this.loadingExcluir = true;
      this.fazendaService.deleteFazenda(fazenda.id).subscribe({
        next: () => {
          this.carregarFazendas();
          alert("Fazenda excluída com sucesso!");
          this.loadingExcluir = false;
        },
        error: (error) => {
          console.error("Erro ao excluir fazenda:", error);
          alert("Erro ao excluir fazenda. Tente novamente.");
          this.loadingExcluir = false;
        },
      });
    }
  }

  fecharModal() {
    this.fechar.emit();
  }

  fecharModalEdicao() {
    this.mostrarModalEdicao = false;
    this.fazendaForm.reset();
    this.loading = false;
  }

  salvarEdicao() {
    if (this.fazendaForm.valid && this.fazendaSelecionada) {
      this.loading = true;
      const dadosAtualizados = {
        ...this.fazendaForm.value,
        id: this.fazendaSelecionada.id,
      };

      this.fazendaService
        .updateFazenda(this.fazendaSelecionada.id, dadosAtualizados)
        .subscribe({
          next: () => {
            this.carregarFazendas();
            this.fecharModalEdicao();
            alert("Fazenda atualizada com sucesso!");
          },
          error: (error) => {
            console.error("Erro ao salvar edição da fazenda:", error);
            alert("Erro ao atualizar fazenda. Tente novamente.");
            this.loading = false;
          },
        });
    }
  }

  areaValidator(group: any) {
    const total = group.get("areatotalfazenda")?.value;
    const agric = group.get("areaagricutavel")?.value;
    if (total == null || agric == null) return null;
    return Number(total) >= Number(agric) ? null : { areaInvalida: true };
  }

  gerenciarSafras(fazenda: Fazenda) {
    this.fazendaSelecionada = fazenda;
    this.mostrarModalSafras = true;
    this.carregarSafras();
  }

  carregarSafras() {
    if (!this.fazendaSelecionada) return;

    this.safraService.getSafrasByFazenda(this.fazendaSelecionada.id).subscribe({
      next: (safras) => {
        this.safrasFiltradas = safras;
      },
      error: (error) => {
        console.error("Erro ao carregar safras:", error);
      },
    });
  }

  selecionarSafra(safra: Safra) {
    this.safraSelecionada = safra;
  }

  editarSafra(safra: Safra) {
    this.loadingEditarSafra = true;
    this.safraSelecionada = safra;
    this.editandoSafra = true;

    // Simular delay de carregamento dos dados
    setTimeout(() => {
      this.safraForm.patchValue({
        ano: safra.ano,
        cultura: safra.cultura,
      });
      this.mostrarModalEdicaoSafra = true;
      this.loadingEditarSafra = false;
    }, 300);
  }

  excluirSafra(safra: Safra) {
    if (
      confirm(
        `Tem certeza que deseja excluir a safra "${safra.cultura} - ${safra.ano}"?`
      )
    ) {
      this.loadingExcluirSafra = true;
      this.safraService.deleteSafra(safra.id).subscribe({
        next: () => {
          this.carregarSafras();
          alert("Safra excluída com sucesso!");
          this.loadingExcluirSafra = false;
        },
        error: (error) => {
          console.error("Erro ao excluir safra:", error);
          alert("Erro ao excluir safra. Tente novamente.");
          this.loadingExcluirSafra = false;
        },
      });
    }
  }

  fecharModalSafras() {
    this.mostrarModalSafras = false;
    this.termoBuscaSafras = "";
    this.safraSelecionada = null;
    this.editandoSafra = false;
    this.safraForm.reset();
  }

  fecharModalEdicaoSafra() {
    this.mostrarModalEdicaoSafra = false;
    this.safraForm.reset();
    this.loading = false;
  }

  filtrarSafras() {
    if (!this.termoBuscaSafras.trim()) {
      this.carregarSafras();
    } else {
      const termo = this.termoBuscaSafras.toLowerCase();
      this.safrasFiltradas = this.safrasFiltradas.filter(
        (safra) =>
          safra.cultura.toLowerCase().includes(termo) ||
          safra.ano.toString().includes(termo)
      );
    }
  }

  adicionarNovaSafra() {
    this.editandoSafra = false;
    this.safraSelecionada = null;
    this.safraForm.reset();
    this.safraForm.patchValue({
      ano: new Date().getFullYear(),
    });
    this.mostrarModalEdicaoSafra = true;
  }

  salvarSafra() {
    if (this.safraForm.valid) {
      this.loading = true;

      if (this.editandoSafra && this.safraSelecionada) {
        // Editar safra existente
        const dadosAtualizados = {
          ...this.safraForm.value,
          id: this.safraSelecionada.id,
          idfazenda: this.fazendaSelecionada!.id,
        };

        this.safraService
          .updateSafra(this.safraSelecionada.id, dadosAtualizados)
          .subscribe({
            next: () => {
              this.carregarSafras();
              this.fecharModalEdicaoSafra();
              alert("Safra atualizada com sucesso!");
            },
            error: (error) => {
              console.error("Erro ao salvar edição da safra:", error);
              alert("Erro ao atualizar safra. Tente novamente.");
              this.loading = false;
            },
          });
      } else {
        // Adicionar nova safra
        const novaSafra = {
          ...this.safraForm.value,
          idfazenda: this.fazendaSelecionada!.id,
        };

        this.safraService.createSafra(novaSafra).subscribe({
          next: () => {
            this.carregarSafras();
            this.fecharModalEdicaoSafra();
            alert("Safra adicionada com sucesso!");
          },
          error: (error) => {
            console.error("Erro ao adicionar safra:", error);
            alert("Erro ao adicionar safra. Tente novamente.");
            this.loading = false;
          },
        });
      }
    }
  }
}
