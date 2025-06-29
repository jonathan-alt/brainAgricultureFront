# Brain Agriculture - Sistema de Gestão Agrícola Inteligente

Sistema frontend Angular moderno para gestão agrícola, desenvolvido com foco em UX intuitiva, validação robusta e integração real com backend REST.

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Angular 17+** - Framework principal
- **NgRx** - Gerenciamento de estado
- **Bootstrap 5** - UI Framework
- **Chart.js** - Gráficos interativos
- **TypeScript** - Linguagem principal
- **Jest** - Testes

### Arquitetura

- **Atomic Design Pattern** - Organização de componentes
- **Module Federation** - Preparado para microfrontends
- **Reactive Forms** - Formulários reativos
- **RxJS** - Programação reativa

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── features/
│   │   └── cadastro/
│   │       └── components/
│   │           ├── cadastro-fluxo/          # Orquestrador do fluxo
│   │           ├── produtor-form/           # Formulário de produtor
│   │           ├── fazenda-form/            # Formulário de fazenda
│   │           ├── safra-form/              # Formulário de safra
│   │           ├── resumo-minimizado/       # Componente de resumo
│   │           ├── editar-produtor-modal/   # Modal de edição
│   │           └── editar-fazenda-modal/    # Modal de edição
│   ├── pages/
│   │   └── home/                            # Página principal
│   ├── shared/
│   │   ├── components/                      # Componentes atômicos
│   │   ├── models/                          # Interfaces TypeScript
│   │   ├── services/                        # Serviços de API
│   │   └── utils/                           # Utilitários
│   └── store/                               # NgRx Store
│       ├── produtor/                        # Estado do produtor
│       ├── fazenda/                         # Estado da fazenda
│       ├── safra/                           # Estado da safra
│       └── dashboard/                       # Estado do dashboard
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend Brain Agriculture rodando

### Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd brainAgricultureFront

# Instalar dependências
npm install

# Configurar ambiente
# Editar src/environments/environment.ts
# apiUrl: "http://localhost:8000/api/v1"

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```
