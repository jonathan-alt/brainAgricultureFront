import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { ReturnSuccess } from "../models";

export interface DadosCompletos {
  produtor?: {
    cpf: string;
    nomeprodutor: string;
  };
  fazenda?: {
    nomefazenda: string;
    cidade: string;
    estado: string;
    areatotalfazenda: number;
    areaagricutavel: number;
  };
  safra?: {
    ano: number;
    cultura: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class DadosCompletosService extends ApiService {
  /**
   * Salva dados completos no backend
   * Aceita 3 cenários:
   * 1. Apenas produtor
   * 2. Produtor + fazenda
   * 3. Produtor + fazenda + safra
   */
  salvarDadosCompletos(dados: DadosCompletos): Observable<ReturnSuccess> {
    return this.post<ReturnSuccess>("/dados-completos", dados);
  }
}
