import { ActionReducerMap } from "@ngrx/store";
import { produtorReducer } from "./produtor/produtor.reducer";
import { fazendaReducer } from "./fazenda/fazenda.reducer";
import { safraReducer } from "./safra/safra.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";

export interface AppState {
  produtor: any;
  fazenda: any;
  safra: any;
  dashboard: any;
}

export const appReducers: ActionReducerMap<AppState> = {
  produtor: produtorReducer,
  fazenda: fazendaReducer,
  safra: safraReducer,
  dashboard: dashboardReducer,
};
