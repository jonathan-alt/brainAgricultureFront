# API - Dados Completos

## Rota: `/api/v1/dados-completos`

### Descrição

Esta rota permite salvar dados de produtor, fazenda e safra de forma hierárquica, aceitando 3 cenários diferentes:

1. **Apenas Produtor** - Salva apenas os dados do produtor
2. **Produtor + Fazenda** - Salva produtor e fazenda vinculados
3. **Produtor + Fazenda + Safra** - Salva produtor, fazenda e safra completos

### Método

`POST`

### Formato da Requisição

```json
{
  "produtor": {
    "cpf": "111.222.333-44",
    "nomeprodutor": "Pedro Oliveira"
  },
  "fazenda": {
    "nomefazenda": "Fazenda Completa",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "areatotalfazenda": 150.0,
    "areaagricutavel": 120.0
  },
  "safra": {
    "ano": 2024,
    "cultura": "Soja"
  }
}
```

### Cenários Suportados

#### 1. Apenas Produtor

```json
{
  "produtor": {
    "cpf": "111.222.333-44",
    "nomeprodutor": "Pedro Oliveira"
  }
}
```

#### 2. Produtor + Fazenda

```json
{
  "produtor": {
    "cpf": "111.222.333-44",
    "nomeprodutor": "Pedro Oliveira"
  },
  "fazenda": {
    "nomefazenda": "Fazenda Completa",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "areatotalfazenda": 150.0,
    "areaagricutavel": 120.0
  }
}
```

#### 3. Produtor + Fazenda + Safra

```json
{
  "produtor": {
    "cpf": "111.222.333-44",
    "nomeprodutor": "Pedro Oliveira"
  },
  "fazenda": {
    "nomefazenda": "Fazenda Completa",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "areatotalfazenda": 150.0,
    "areaagricutavel": 120.0
  },
  "safra": {
    "ano": 2024,
    "cultura": "Soja"
  }
}
```

### Resposta de Sucesso

```json
{
  "success": true,
  "message": "Dados salvos com sucesso"
}
```

### Resposta de Erro

```json
{
  "success": false,
  "message": "Erro ao salvar dados",
  "error": "Detalhes do erro"
}
```

### Validações

- **Produtor**: CPF válido e nome com pelo menos 2 palavras
- **Fazenda**: Área total deve ser maior ou igual à área agricultável
- **Safra**: Ano deve ser maior ou igual a 2000

### Implementação Frontend

O frontend Angular utiliza o `DadosCompletosService` para fazer as chamadas:

```typescript
// Serviço
salvarDadosCompletos(dados: DadosCompletos): Observable<ReturnSuccess> {
  return this.post<ReturnSuccess>("/api/v1/dados-completos", dados);
}

// Uso no componente
this.dadosCompletosService.salvarDadosCompletos(dadosCompletos).subscribe({
  next: (response) => {
    // Sucesso
  },
  error: (error) => {
    // Erro
  }
});
```
