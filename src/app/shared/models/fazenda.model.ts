export interface Fazenda {
  id: number;
  nomefazenda: string;
  cidade: string;
  estado: string;
  areatotalfazenda: number;
  areaagricutavel: number;
  idprodutor: number;
}

export interface FazendaCreate {
  nomefazenda: string;
  cidade: string;
  estado: string;
  areatotalfazenda: number;
  areaagricutavel: number;
  idprodutor?: number;
}

export interface FazendaResumida {
  id: number;
  nomefazenda: string;
}
