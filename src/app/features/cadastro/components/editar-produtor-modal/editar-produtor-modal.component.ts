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
import { ProdutorService } from "../../../../shared/services/produtor.service";
import { Produtor, ProdutorCreate } from "../../../../shared/models";
import { CustomValidators } from "../../../../shared/utils/validators";
import { cpf } from "cpf-cnpj-validator";

@Component({
  selector: "app-editar-produtor-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-edit me-2"></i>Editar Produtores
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
                placeholder="Buscar produtor por nome ou CPF..."
                [(ngModel)]="termoBusca"
                (input)="filtrarProdutores()"
              />
            </div>
          </div>

          <!-- Lista de Produtores -->
          <div class="produtores-lista">
            <div
              *ngFor="let produtor of produtoresFiltrados"
              class="produtor-item"
              [class.selected]="produtorSelecionado?.id === produtor.id"
              (click)="selecionarProdutor(produtor)"
            >
              <div class="produtor-info">
                <h6 class="produtor-nome">{{ produtor.nomeprodutor }}</h6>
                <p class="produtor-cpf">{{ produtor.cpf }}</p>
              </div>
              <div class="produtor-acoes">
                <button
                  class="btn btn-sm btn-outline-primary"
                  (click)="editarProdutor(produtor)"
                  title="Editar Produtor"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  (click)="excluirProdutor(produtor)"
                  title="Excluir Produtor"
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
              *ngIf="produtoresFiltrados.length === 0"
              class="text-center py-4"
            >
              <i class="fas fa-search fa-2x text-muted mb-2"></i>
              <p class="text-muted">Nenhum produtor encontrado</p>
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
            <i class="fas fa-edit me-2"></i>Editar Produtor
          </h5>
          <button type="button" class="btn-close" (click)="fecharModalEdicao()">
            ×
          </button>
        </div>

        <div class="modal-body">
          <form [formGroup]="produtorForm" (ngSubmit)="salvarEdicao()">
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
                  *ngIf="produtorForm.get('nomeprodutor')?.errors?.['required']"
                >
                  Nome do produtor é obrigatório.
                </div>
                <div
                  *ngIf="
                    produtorForm.get('nomeprodutor')?.errors?.['nomeInvalido']
                  "
                >
                  Nome deve conter pelo menos duas palavras.
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
                <div *ngIf="produtorForm.get('cpf')?.errors?.['required']">
                  CPF é obrigatório.
                </div>
                <div *ngIf="produtorForm.get('cpf')?.errors?.['cpfInvalido']">
                  CPF inválido.
                </div>
              </div>
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
                [disabled]="produtorForm.invalid || loading"
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
        max-width: 600px;
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

      .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
      }

      .produtores-lista {
        max-height: 400px;
        overflow-y: auto;
      }

      .produtor-item {
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

      .produtor-item:hover {
        background: #f8f9fa;
        border-color: var(--primary-color);
      }

      .produtor-item.selected {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .produtor-info {
        flex: 1;
      }

      .produtor-nome {
        margin: 0;
        font-weight: 600;
        font-size: 1rem;
      }

      .produtor-cpf {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .produtor-acoes {
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
        max-width: 500px;
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

      .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
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
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
      }
    `,
  ],
})
export class EditarProdutorModalComponent {
  @Output() fechar = new EventEmitter<void>();

  produtores: Produtor[] = [];
  produtoresFiltrados: Produtor[] = [];
  produtorSelecionado: Produtor | null = null;
  termoBusca = "";

  produtorForm: FormGroup;
  mostrarModalEdicao = false;
  loading = false;
  loadingExcluir = false;

  constructor(
    private produtorService: ProdutorService,
    private store: Store,
    private fb: FormBuilder
  ) {
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

    this.carregarProdutores();
  }

  carregarProdutores() {
    this.produtorService.getAllProdutores().subscribe({
      next: (produtores) => {
        this.produtores = produtores;
        this.produtoresFiltrados = produtores;
      },
      error: (error) => {
        console.error("Erro ao carregar produtores:", error);
      },
    });
  }

  filtrarProdutores() {
    if (!this.termoBusca.trim()) {
      this.produtoresFiltrados = this.produtores;
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.produtoresFiltrados = this.produtores.filter(
        (produtor) =>
          produtor.nomeprodutor.toLowerCase().includes(termo) ||
          produtor.cpf.includes(termo)
      );
    }
  }

  selecionarProdutor(produtor: Produtor) {
    this.produtorSelecionado = produtor;
  }

  editarProdutor(produtor: Produtor) {
    this.produtorSelecionado = produtor;
    this.produtorForm.patchValue({
      nomeprodutor: produtor.nomeprodutor,
      cpf: produtor.cpf,
    });
    this.mostrarModalEdicao = true;
  }

  excluirProdutor(produtor: Produtor) {
    if (
      confirm(
        `Tem certeza que deseja excluir o produtor "${produtor.nomeprodutor}"?`
      )
    ) {
      this.loadingExcluir = true;
      this.produtorService.deleteProdutor(produtor.id).subscribe({
        next: () => {
          this.carregarProdutores();
          alert("Produtor excluído com sucesso!");
          this.loadingExcluir = false;
        },
        error: (error) => {
          console.error("Erro ao excluir produtor:", error);
          alert("Erro ao excluir produtor. Tente novamente.");
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
    this.produtorForm.reset();
    this.loading = false;
    this.loadingExcluir = false;
  }

  salvarEdicao() {
    if (this.produtorForm.valid && this.produtorSelecionado) {
      this.loading = true;
      const dadosAtualizados = {
        ...this.produtorForm.value,
        id: this.produtorSelecionado.id,
      };

      this.produtorService
        .updateProdutor(this.produtorSelecionado.id, dadosAtualizados)
        .subscribe({
          next: () => {
            this.carregarProdutores();
            this.fecharModalEdicao();
            alert("Produtor atualizado com sucesso!");
          },
          error: (error) => {
            console.error("Erro ao salvar edição do produtor:", error);
            alert("Erro ao atualizar produtor. Tente novamente.");
            this.loading = false;
          },
        });
    }
  }

  nomeValidator(control: any) {
    const value = control.value || "";
    return value.trim().split(" ").length >= 2 ? null : { nomeInvalido: true };
  }

  cpfValidator(control: any) {
    const value = control.value || "";
    return cpf.isValid(value) ? null : { cpfInvalido: true };
  }
}
