import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { CadastroFluxoComponent } from "../../features/cadastro/components/cadastro-fluxo/cadastro-fluxo.component";
import { EditarProdutorModalComponent } from "../../features/cadastro/components/editar-produtor-modal/editar-produtor-modal.component";
import { EditarFazendaModalComponent } from "../../features/cadastro/components/editar-fazenda-modal/editar-fazenda-modal.component";
import { CadastrarProdutorModalComponent } from "../../features/cadastro/components/cadastrar-produtor-modal/cadastrar-produtor-modal.component";
import { DashboardService } from "../../shared/services/dashboard.service";
import { DadosCompletosService } from "../../shared/services/dados-completos.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CadastroFluxoComponent,
    EditarProdutorModalComponent,
    EditarFazendaModalComponent,
    CadastrarProdutorModalComponent,
  ],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <div class="navbar-brand">
          <div class="logo">🌿</div>
          <span class="brand-text">Brain Agriculture</span>
        </div>
        <div class="navbar-actions">
          <a (click)="openCadastroProdutor()" title="Novo Produtor">
            <span>➕</span>
            <span class="nav-text">Novo Produtor</span>
          </a>
          <a (click)="openEditarProdutor()" title="Editar Produtor">
            <span>👤</span>
            <span class="nav-text">Editar Produtor</span>
          </a>
          <a (click)="openEditarFazenda()" title="Editar Fazenda">
            <span>✍️</span>
            <span class="nav-text">Editar Fazenda</span>
          </a>
        </div>
      </nav>

      <main class="main-content">
        <!-- Fluxo de Cadastro -->
        <section *ngIf="fluxoCadastroAberto">
          <app-cadastro-fluxo
            (cancelar)="fecharFluxoCadastro()"
            (salvar)="fecharFluxoCadastro()"
          ></app-cadastro-fluxo>
        </section>

        <!-- Modal Editar Produtor -->
        <app-editar-produtor-modal
          *ngIf="modalProdutorAberto"
          (fechar)="fecharModalProdutor()"
        ></app-editar-produtor-modal>

        <!-- Modal Editar Fazenda -->
        <app-editar-fazenda-modal
          *ngIf="modalFazendaAberto"
          (fechar)="fecharModalFazenda()"
        ></app-editar-fazenda-modal>

        <!-- Modal Cadastrar Produtor -->
        <app-cadastrar-produtor-modal
          *ngIf="cadastrarProdutorModalAberto"
          (fechar)="fecharCadastrarProdutorModal()"
          (salvar)="onSalvarProdutorHierarquico($event)"
        ></app-cadastrar-produtor-modal>

        <!-- Dashboard -->
        <section
          *ngIf="
            !fluxoCadastroAberto &&
            !modalProdutorAberto &&
            !modalFazendaAberto &&
            !cadastrarProdutorModalAberto
          "
        >
          <header class="header">
            <h1>Dashboard</h1>
            <p>Sistema de Gestão Agrícola Inteligente</p>
          </header>

          <section class="stats">
            <div class="card">
              <p class="value">
                <span>📍</span>
                <span class="hectare-value">{{
                  resumoFazendas?.total_fazendas || 0
                }}</span>
              </p>
              <p>Total de Fazendas</p>
            </div>
            <div class="card">
              <p class="value">
                <span>🌾</span>
                <span class="hectare-value">{{
                  resumoFazendas?.total_area || 0 | number: "1.0-2"
                }}</span>
                <span class="hectare-unit">ha</span>
              </p>
              <p>Total de Hectares</p>
            </div>
          </section>

          <section class="charts">
            <div class="chart-card">
              <h3>Uso do Solo</h3>
              <div class="chart-container">
                <canvas id="soloChart" width="400" height="300"></canvas>
              </div>
            </div>
            <div class="chart-card">
              <h3>Fazendas por Estado</h3>
              <div class="chart-container">
                <canvas id="estadoChart" width="400" height="300"></canvas>
              </div>
            </div>
            <div class="chart-card">
              <h3>Culturas Plantadas</h3>
              <div class="chart-container">
                <canvas id="culturaChart" width="400" height="300"></canvas>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Segoe UI", sans-serif;
        background-color: #f7fbf7;
        color: #333;
      }

      .dashboard {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .navbar {
        width: 100%;
        background-color: #e0f2e9;
        padding: 0.75rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .navbar-brand .logo {
        font-size: 1.5rem;
      }

      .navbar-brand .brand-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2e7d32;
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .navbar-actions a {
        font-size: 1.25rem;
        color: #2e7d32;
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
        position: relative;
      }

      .navbar-actions a:hover {
        background-color: #2e7d32;
        color: white;
        transform: scale(1.05);
      }

      .nav-text {
        font-size: 0.875rem;
        font-weight: 500;
        color: inherit;
      }

      .main-content {
        flex: 1;
        padding: 2rem 12rem;
        display: flex;
        flex-direction: column;
      }

      .header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .header h1 {
        font-size: 1.8rem;
        color: #1b5e20;
        margin-bottom: 0.5rem;
      }

      .header p {
        font-size: 1rem;
        color: #4b4b4b;
      }

      .stats {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        margin-bottom: 2rem;
      }

      .card {
        background-color: #ffffff;
        padding: 1.2rem;
        border-radius: 12px;
        text-align: center;
        width: 180px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      .card .value {
        font-size: 1.4rem;
        font-weight: bold;
        color: #2e7d32;
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      .card .hectare-unit {
        font-size: 1.4rem;
        font-weight: bold;
        color: #2e7d32;
        margin-top: 0;
        line-height: 1;
      }

      /* Alinhar o texto do card de Total de Fazendas */
      .card:first-child p:last-child {
        margin-top: 1.3rem;
      }

      .card p:last-child {
        color: #666;
        font-size: 0.9rem;
      }

      .charts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .chart-card {
        background-color: #ffffff;
        padding: 1.2rem;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
      }

      .chart-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      .chart-card h3 {
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #1b5e20;
        font-weight: 600;
      }

      .chart-container {
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        position: relative;
      }

      .chart-container canvas {
        max-width: 100%;
        max-height: 100%;
        width: auto !important;
        height: auto !important;
      }

      /* Responsividade */
      @media (max-width: 1200px) {
        .main-content {
          padding: 1.5rem 2.5rem;
        }

        .stats {
          gap: 1rem;
        }

        .charts {
          gap: 1rem;
        }
      }

      @media (max-width: 992px) {
        .navbar {
          padding: 0.75rem 1rem;
        }

        .navbar-brand .brand-text {
          font-size: 1rem;
        }

        .navbar-actions {
          gap: 0.5rem;
        }

        .navbar-actions a {
          padding: 0.4rem;
          font-size: 1.1rem;
        }

        .nav-text {
          display: none;
        }

        .main-content {
          padding: 1.5rem 2rem;
        }

        .stats {
          flex-direction: column;
          align-items: center;
        }

        .card {
          width: 100%;
          max-width: 300px;
        }

        .charts {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 1rem 1.5rem;
        }

        .header h1 {
          font-size: 1.5rem;
        }

        .header p {
          font-size: 0.9rem;
        }

        .card .value {
          font-size: 1.2rem;
        }

        .chart-card {
          padding: 1rem;
        }

        .chart-container {
          height: 280px;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  resumoFazendas: any = null;
  estatisticasFazendas: any = null;
  estatisticasCulturas: any = null;
  estatisticasAreas: any = null;
  fluxoCadastroAberto = false;
  modalProdutorAberto = false;
  modalFazendaAberto = false;
  cadastrarProdutorModalAberto = false;

  // Instâncias dos gráficos
  private estadoChart: any = null;
  private culturaChart: any = null;
  private soloChart: any = null;

  constructor(
    private dashboardService: DashboardService,
    private dadosCompletosService: DadosCompletosService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Carregar resumo de fazendas
    this.dashboardService.getResumoFazendas().subscribe({
      next: (resumo) => {
        this.resumoFazendas = resumo;
      },
      error: (error) => {
        console.error("Erro ao carregar resumo de fazendas:", error);
      },
    });

    // Carregar estatísticas de fazendas por estado
    this.dashboardService.getEstatisticasFazendas().subscribe({
      next: (estatisticas) => {
        this.estatisticasFazendas = estatisticas;
        this.renderizarGraficoEstados();
      },
      error: (error) => {
        console.error("Erro ao carregar estatísticas de fazendas:", error);
      },
    });

    // Carregar estatísticas de culturas
    this.dashboardService.getEstatisticasCulturas().subscribe({
      next: (estatisticas) => {
        this.estatisticasCulturas = estatisticas;
        this.renderizarGraficoCulturas();
      },
      error: (error) => {
        console.error("Erro ao carregar estatísticas de culturas:", error);
      },
    });

    // Carregar estatísticas de áreas
    this.dashboardService.getEstatisticasAreas().subscribe({
      next: (estatisticas) => {
        this.estatisticasAreas = estatisticas;
        this.renderizarGraficoSolo();
      },
      error: (error) => {
        console.error("Erro ao carregar estatísticas de áreas:", error);
      },
    });
  }

  renderizarGraficoEstados() {
    if (!this.estatisticasFazendas?.fazendas_por_estado) return;

    const ctx = document.getElementById("estadoChart") as HTMLCanvasElement;
    if (!ctx) return;

    // Destruir gráfico existente se houver
    if (this.estadoChart) {
      this.estadoChart.destroy();
    }

    const data = {
      labels: this.estatisticasFazendas.fazendas_por_estado.map(
        (item: any) => item.estado
      ),
      datasets: [
        {
          data: this.estatisticasFazendas.fazendas_por_estado.map(
            (item: any) => item.quantidade
          ),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
            "#4BC0C0",
            "#FF6384",
          ],
        },
      ],
    };

    this.estadoChart = new (window as any).Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
              boxWidth: 18,
              padding: 12,
              font: {
                size: 13,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context: any) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total =
                  context.chart._metasets[context.datasetIndex].total;
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });
  }

  renderizarGraficoCulturas() {
    if (!this.estatisticasCulturas?.culturas) return;

    const ctx = document.getElementById("culturaChart") as HTMLCanvasElement;
    if (!ctx) return;

    // Destruir gráfico existente se houver
    if (this.culturaChart) {
      this.culturaChart.destroy();
    }

    const data = {
      labels: this.estatisticasCulturas.culturas.map(
        (item: any) => item.cultura
      ),
      datasets: [
        {
          data: this.estatisticasCulturas.culturas.map(
            (item: any) => item.quantidade
          ),
          backgroundColor: [
            "#4BC0C0",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#FF6384",
            "#4BC0C0",
            "#36A2EB",
          ],
        },
      ],
    };

    this.culturaChart = new (window as any).Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
              boxWidth: 18,
              padding: 12,
              font: {
                size: 13,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context: any) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total =
                  context.chart._metasets[context.datasetIndex].total;
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });
  }

  renderizarGraficoSolo() {
    if (!this.estatisticasAreas) return;

    const ctx = document.getElementById("soloChart") as HTMLCanvasElement;
    if (!ctx) return;

    // Destruir gráfico existente se houver
    if (this.soloChart) {
      this.soloChart.destroy();
    }

    const data = {
      labels: ["Área Agricultável", "Área de Vegetação"],
      datasets: [
        {
          data: [
            this.estatisticasAreas.area_agricultavel,
            this.estatisticasAreas.area_vegetacao,
          ],
          backgroundColor: ["#4BC0C0", "#36A2EB"],
        },
      ],
    };

    this.soloChart = new (window as any).Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
              boxWidth: 18,
              padding: 12,
              font: {
                size: 13,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context: any) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total =
                  context.chart._metasets[context.datasetIndex].total;
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });
  }

  openCadastroProdutor(): void {
    this.cadastrarProdutorModalAberto = true;
    // Limpar gráficos quando abrir modal
    this.limparGraficos();
  }

  openEditarProdutor(): void {
    this.modalProdutorAberto = true;
    // Limpar gráficos quando abrir modal
    this.limparGraficos();
  }

  openEditarFazenda(): void {
    this.modalFazendaAberto = true;
    // Limpar gráficos quando abrir modal
    this.limparGraficos();
  }

  fecharFluxoCadastro(): void {
    this.fluxoCadastroAberto = false;
  }

  fecharModalProdutor(): void {
    this.modalProdutorAberto = false;
    // Re-renderizar gráficos após fechar modal
    setTimeout(() => {
      this.reRenderizarGraficos();
    }, 100);
  }

  fecharModalFazenda(): void {
    this.modalFazendaAberto = false;
    // Re-renderizar gráficos após fechar modal
    setTimeout(() => {
      this.reRenderizarGraficos();
    }, 100);
  }

  fecharCadastrarProdutorModal(): void {
    this.cadastrarProdutorModalAberto = false;
    // Re-renderizar gráficos após fechar modal
    setTimeout(() => {
      this.reRenderizarGraficos();
    }, 100);
  }

  reRenderizarGraficos(): void {
    // Re-renderizar todos os gráficos se os dados existirem
    if (this.estatisticasFazendas) {
      this.renderizarGraficoEstados();
    }
    if (this.estatisticasCulturas) {
      this.renderizarGraficoCulturas();
    }
    if (this.estatisticasAreas) {
      this.renderizarGraficoSolo();
    }
  }

  onSalvarProdutorHierarquico(dados: any) {
    console.log("Dados hierárquicos recebidos:", dados);

    // Preparar dados para a rota /api/v1/dados-completos
    const dadosCompletos: any = {};

    if (dados.produtor) {
      dadosCompletos.produtor = dados.produtor;
    }
    if (dados.fazendas && dados.fazendas.length > 0) {
      dadosCompletos.fazendas = dados.fazendas;
    }
    if (dados.safras && dados.safras.length > 0) {
      dadosCompletos.safras = dados.safras;
    }

    // Salvar usando a rota /api/v1/dados-completos
    this.dadosCompletosService.salvarDadosCompletos(dadosCompletos).subscribe({
      next: (response) => {
        // Determinar mensagem baseada nos dados enviados
        let mensagem = "";

        if (
          dados.produtor &&
          dados.fazendas &&
          dados.fazendas.length > 0 &&
          dados.safras &&
          dados.safras.length > 0
        ) {
          mensagem = `Cadastro completo realizado!\n\nProdutor: ${dados.produtor.nomeprodutor}\nFazendas: ${dados.fazendas.length}\nSafras: ${dados.safras.length}`;
        } else if (
          dados.produtor &&
          dados.fazendas &&
          dados.fazendas.length > 0
        ) {
          mensagem = `Produtor e Fazendas cadastrados!\n\nProdutor: ${dados.produtor.nomeprodutor}\nFazendas: ${dados.fazendas.length}`;
        } else if (dados.produtor) {
          mensagem = `Produtor cadastrado com sucesso!\n\nNome: ${dados.produtor.nomeprodutor}`;
        }

        alert(mensagem);

        // Recarregar dados do dashboard após salvar
        this.loadDashboardData();
      },
      error: (error) => {
        console.error("Erro ao salvar dados:", error);
        alert("Erro ao salvar dados. Tente novamente.");
      },
    });

    this.fecharCadastrarProdutorModal();
  }

  limparGraficos(): void {
    // Destruir gráficos existentes
    if (this.estadoChart) {
      this.estadoChart.destroy();
      this.estadoChart = null;
    }
    if (this.culturaChart) {
      this.culturaChart.destroy();
      this.culturaChart = null;
    }
    if (this.soloChart) {
      this.soloChart.destroy();
      this.soloChart = null;
    }
  }
}
