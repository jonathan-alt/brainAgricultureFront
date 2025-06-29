import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {
  EstatisticasFazendas,
  EstatisticasCulturas,
  EstatisticasAreas,
  ResumoFazendas,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends ApiService {
  getEstatisticasFazendas(): Observable<EstatisticasFazendas> {
    return this.get<EstatisticasFazendas>("/fazendas/estatisticas");
  }

  getEstatisticasCulturas(): Observable<EstatisticasCulturas> {
    return this.get<EstatisticasCulturas>("/safras/estatisticas-culturas");
  }

  getEstatisticasAreas(): Observable<EstatisticasAreas> {
    return this.get<EstatisticasAreas>("/fazendas/estatisticas-areas");
  }

  getResumoFazendas(): Observable<ResumoFazendas> {
    return this.get<ResumoFazendas>("/fazendas/resumo");
  }
}
