import { createReducer, on } from "@ngrx/store";
import {
  EstatisticasFazendas,
  EstatisticasCulturas,
  EstatisticasAreas,
  ResumoFazendas,
} from "../../shared/models";

export interface DashboardState {
  estatisticasFazendas: EstatisticasFazendas | null;
  estatisticasCulturas: EstatisticasCulturas | null;
  estatisticasAreas: EstatisticasAreas | null;
  resumoFazendas: ResumoFazendas | null;
  loading: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  estatisticasFazendas: null,
  estatisticasCulturas: null,
  estatisticasAreas: null,
  resumoFazendas: null,
  loading: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState
  // Implementar actions conforme necessário
);
