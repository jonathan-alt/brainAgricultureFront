export interface Produtor {
  id: number;
  cpf: string;
  nomeprodutor: string;
}

export interface ProdutorCreate {
  cpf: string;
  nomeprodutor: string;
}

export interface ProdutorResumido {
  id: number;
  cpf: string;
  nomeprodutor: string;
}
