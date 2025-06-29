export interface EstatisticasFazendas {
  total_fazendas: number;
  fazendas_por_estado: FazendaPorEstado[];
}

export interface FazendaPorEstado {
  estado: string;
  quantidade: number;
}

export interface EstatisticasCulturas {
  total_culturas: number;
  culturas: CulturaQuantidade[];
}

export interface CulturaQuantidade {
  cultura: string;
  quantidade: number;
}

export interface EstatisticasAreas {
  area_total: number;
  area_agricultavel: number;
  area_vegetacao: number;
}

export interface ResumoFazendas {
  total_fazendas: number;
  total_area: number;
}

export interface ReturnSuccess {
  success: boolean;
  message: string;
  data: any;
}
