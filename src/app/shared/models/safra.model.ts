export interface Safra {
  id: number;
  ano: number;
  cultura: string;
  idfazenda: number;
}

export interface SafraCreate {
  ano: number;
  cultura: string;
  idfazenda: number;
}
