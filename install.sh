#!/bin/bash

echo "Instalando dependências do Brain Agriculture Frontend..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "Node.js $(node -v) encontrado"

# Instalar dependências
echo "Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "Dependências instaladas com sucesso!"
else
    echo "Erro ao instalar dependências"
    exit 1
fi

# Criar arquivo de configuração de ambiente se não existir
if [ ! -f "src/environments/environment.ts" ]; then
    echo "🔧 Criando arquivo de ambiente..."
    mkdir -p src/environments
    cat > src/environments/environment.ts << EOF
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1'
};
EOF
fi

echo ""
echo "Instalação concluída!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm start"
echo ""
echo "Para executar os testes:"
echo "  npm test"
echo ""
echo "Para fazer o build de produção:"
echo "  npm run build:prod"
echo ""
echo "Certifique-se de que o backend está rodando na porta 8000"
echo "   ou ajuste a URL da API em src/environments/environment.ts" 