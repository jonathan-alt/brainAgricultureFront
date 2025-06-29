import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ProdutorFormComponent } from "../produtor-form/produtor-form.component";
import { FazendaFormComponent } from "../fazenda-form/fazenda-form.component";
import { SafraFormComponent } from "../safra-form/safra-form.component";
import { ResumoMinimizadoComponent } from "../resumo-minimizado/resumo-minimizado.component";
import * as ProdutorActions from "../../../../store/produtor/produtor.actions";
import * as FazendaActions from "../../../../store/fazenda/fazenda.actions";
import * as SafraActions from "../../../../store/safra/safra.actions";
import {
  ProdutorCreate,
  FazendaCreate,
  SafraCreate,
} from "../../../../shared/models";

@Component({
  selector: "app-cadastro-fluxo",
  standalone: true,
  imports: [
    CommonModule,
    ProdutorFormComponent,
    FazendaFormComponent,
    SafraFormComponent,
    ResumoMinimizadoComponent,
  ],
  template: `
    <div class="cadastro-fluxo-container">
      <!-- Loading Overlay -->
      <div *ngIf="loading$ | async" class="loading-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <!-- Error Alert -->
      <div
        *ngIf="error$ | async as error"
        class="alert alert-danger"
        role="alert"
      >
        {{ error }}
      </div>

      <!-- Bloco Produtor -->
      <ng-container *ngIf="!produtorMinimizado">
        <app-produtor-form
          (salvar)="onSalvarProdutor($event)"
          (cancelar)="onCancelar()"
        ></app-produtor-form>
      </ng-container>
      <ng-container *ngIf="produtorMinimizado">
        <app-resumo-minimizado
          [tipo]="'produtor'"
          [dados]="produtor"
          (expandir)="expandirProdutor()"
        ></app-resumo-minimizado>
        <!-- Botão Adicionar Fazenda -->
        <div class="text-center mt-3" *ngIf="produtorMinimizado && !fazenda">
          <button class="btn btn-outline-primary" (click)="adicionarFazenda()">
            <i class="fas fa-plus me-2"></i>Adicionar Fazenda
          </button>
        </div>
      </ng-container>

      <!-- Bloco Fazenda -->
      <ng-container *ngIf="produtor && !fazendaMinimizada">
        <app-fazenda-form
          (salvar)="onSalvarFazenda($event)"
          (cancelar)="onCancelar()"
        ></app-fazenda-form>
      </ng-container>
      <ng-container *ngIf="fazendaMinimizada">
        <app-resumo-minimizado
          [tipo]="'fazenda'"
          [dados]="fazenda"
          (expandir)="expandirFazenda()"
        ></app-resumo-minimizado>
        <!-- Botão Adicionar Safra -->
        <div class="text-center mt-3" *ngIf="fazendaMinimizada && !safra">
          <button class="btn btn-outline-success" (click)="adicionarSafra()">
            <i class="fas fa-plus me-2"></i>Adicionar Safra
          </button>
        </div>
      </ng-container>

      <!-- Bloco Safra -->
      <ng-container *ngIf="fazenda && !safraMinimizada">
        <app-safra-form
          (salvar)="onSalvarSafra($event)"
          (cancelar)="onCancelar()"
        ></app-safra-form>
      </ng-container>
      <ng-container *ngIf="safraMinimizada">
        <app-resumo-minimizado
          [tipo]="'safra'"
          [dados]="safra"
          (expandir)="expandirSafra()"
        ></app-resumo-minimizado>
      </ng-container>

      <!-- Botões de ação -->
      <div class="acoes-fluxo">
        <button
          class="btn btn-success"
          [disabled]="!podeSalvar() || (loading$ | async)"
          (click)="onSalvarFluxo()"
        >
          <span
            *ngIf="loading$ | async"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          Salvar
        </button>
        <button
          class="btn btn-secondary"
          [disabled]="loading$ | async"
          (click)="onCancelar()"
        >
          Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .cadastro-fluxo-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem 1rem;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 16px rgba(34, 43, 69, 0.07);
        position: relative;
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        z-index: 10;
      }
      .acoes-fluxo {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }
      .alert {
        margin-bottom: 1rem;
        border-radius: 8px;
      }
    `,
  ],
})
export class CadastroFluxoComponent {
  @Output() salvar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  produtor: ProdutorCreate | null = null;
  fazenda: FazendaCreate | null = null;
  safra: SafraCreate | null = null;
  produtorMinimizado = false;
  fazendaMinimizada = false;
  safraMinimizada = false;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    // Combinar loading de todos os estados
    this.loading$ = new Observable((observer) => {
      const subscription = this.store
        .select(
          (state: any) =>
            state.produtor.loading ||
            state.fazenda.loading ||
            state.safra.loading
        )
        .subscribe(observer);
      return () => subscription.unsubscribe();
    });

    // Combinar erros de todos os estados
    this.error$ = new Observable((observer) => {
      const subscription = this.store
        .select(
          (state: any) =>
            state.produtor.error || state.fazenda.error || state.safra.error
        )
        .subscribe(observer);
      return () => subscription.unsubscribe();
    });
  }

  onSalvarProdutor(produtor: ProdutorCreate) {
    this.produtor = produtor;
    this.produtorMinimizado = true;
  }

  expandirProdutor() {
    this.produtorMinimizado = false;
  }

  onSalvarFazenda(fazenda: FazendaCreate) {
    this.fazenda = fazenda;
    this.fazendaMinimizada = true;
  }

  expandirFazenda() {
    this.fazendaMinimizada = false;
  }

  onSalvarSafra(safra: SafraCreate) {
    this.safra = safra;
    this.safraMinimizada = true;
  }

  expandirSafra() {
    this.safraMinimizada = false;
  }

  podeSalvar(): boolean {
    return (
      (this.produtorMinimizado && !this.fazenda && !this.safra) ||
      (this.produtorMinimizado && this.fazendaMinimizada && !this.safra) ||
      (this.produtorMinimizado &&
        this.fazendaMinimizada &&
        this.safraMinimizada)
    );
  }

  onSalvarFluxo() {
    if (!this.podeSalvar()) return;

    // Enviar dados conforme o fluxo
    if (this.produtor && this.fazenda && this.safra) {
      // Produtor + Fazenda + Safra - enviar sequencialmente
      this.enviarSequencialmente();
    } else if (this.produtor && this.fazenda) {
      // Produtor + Fazenda
      this.store.dispatch(
        ProdutorActions.cadastrarProdutor({ produtor: this.produtor })
      );
      // A fazenda será enviada após o sucesso do produtor
    } else if (this.produtor) {
      // Apenas Produtor
      this.store.dispatch(
        ProdutorActions.cadastrarProdutor({ produtor: this.produtor })
      );
    }

    // Escutar sucesso para fechar o fluxo
    this.loading$.subscribe((loading) => {
      if (!loading) {
        this.error$.subscribe((error) => {
          if (!error) {
            setTimeout(() => this.salvar.emit(), 500); // Pequeno delay para feedback visual
          }
        });
      }
    });
  }

  private enviarSequencialmente() {
    // Enviar produtor primeiro
    this.store.dispatch(
      ProdutorActions.cadastrarProdutor({ produtor: this.produtor! })
    );

    // Aguardar sucesso do produtor para enviar fazenda
    const subscription = this.store
      .select((state: any) => state.produtor)
      .subscribe((produtorState) => {
        if (!produtorState.loading && !produtorState.error && this.fazenda) {
          // Produtor criado com sucesso, enviar fazenda
          this.store.dispatch(
            FazendaActions.cadastrarFazenda({ fazenda: this.fazenda })
          );

          // Aguardar sucesso da fazenda para enviar safra
          const fazendaSubscription = this.store
            .select((state: any) => state.fazenda)
            .subscribe((fazendaState) => {
              if (!fazendaState.loading && !fazendaState.error && this.safra) {
                // Fazenda criada com sucesso, enviar safra
                this.store.dispatch(
                  SafraActions.cadastrarSafra({ safra: this.safra })
                );
                fazendaSubscription.unsubscribe();
              }
            });

          subscription.unsubscribe();
        }
      });
  }

  onCancelar() {
    // Resetar estados
    this.store.dispatch(ProdutorActions.resetCadastroProdutor());
    this.store.dispatch(FazendaActions.resetCadastroFazenda());
    this.store.dispatch(SafraActions.resetCadastroSafra());

    // Resetar fluxo
    this.produtor = null;
    this.fazenda = null;
    this.safra = null;
    this.produtorMinimizado = false;
    this.fazendaMinimizada = false;
    this.safraMinimizada = false;
    this.cancelar.emit();
  }

  adicionarFazenda() {
    this.fazendaMinimizada = false;
  }

  adicionarSafra() {
    this.safraMinimizada = false;
  }
}
