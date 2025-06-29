import { Component, Output, EventEmitter, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-resumo-minimizado",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resumo-minimizado-card">
      <div class="resumo-content">
        <div class="resumo-tipo">{{ tipo | titlecase }}</div>
        <div class="resumo-dados">
          <ng-container [ngSwitch]="tipo">
            <div *ngSwitchCase="'produtor'">
              <strong>{{ dados?.nomeprodutor }}</strong>
              <span class="resumo-detalhe">{{ dados?.cpf }}</span>
            </div>
            <div *ngSwitchCase="'fazenda'">
              <strong>{{ dados?.nomefazenda }}</strong>
              <span class="resumo-detalhe"
                >{{ dados?.cidade }}, {{ dados?.estado }}</span
              >
            </div>
            <div *ngSwitchCase="'safra'">
              <strong>{{ dados?.cultura }}</strong>
              <span class="resumo-detalhe">{{ dados?.ano }}</span>
            </div>
          </ng-container>
        </div>
      </div>
      <button class="btn btn-link btn-expandir" (click)="expandir.emit()">
        <i class="fas fa-edit"></i> Editar
      </button>
    </div>
  `,
  styles: [
    `
      .resumo-minimizado-card {
        background: var(--background-white);
        border-radius: 12px;
        box-shadow: var(--shadow-light);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.2rem;
        min-width: 0;
      }
      .resumo-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
      .resumo-tipo {
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 0.3rem;
      }
      .resumo-dados {
        font-size: 1.05rem;
        color: var(--text-primary);
      }
      .resumo-dados strong {
        display: block;
        margin-bottom: 0.2rem;
      }
      .resumo-detalhe {
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      .btn-expandir {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 1rem;
        text-decoration: underline;
        border: none;
        background: none;
        cursor: pointer;
        margin-left: 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .btn-expandir i {
        font-size: 1.1rem;
      }
    `,
  ],
})
export class ResumoMinimizadoComponent {
  @Input() tipo: "produtor" | "fazenda" | "safra" = "produtor";
  @Input() dados: any = null;
  @Output() expandir = new EventEmitter<void>();
}
