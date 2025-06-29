import { createReducer, on } from "@ngrx/store";
import { Fazenda, FazendaResumida } from "../../shared/models";
import * as FazendaActions from "./fazenda.actions";

export interface FazendaState {
  fazendas: Fazenda[];
  fazendasResumidas: FazendaResumida[];
  loading: boolean;
  error: string | null;
}

export const initialState: FazendaState = {
  fazendas: [],
  fazendasResumidas: [],
  loading: false,
  error: null,
};

export const fazendaReducer = createReducer(
  initialState,
  on(FazendaActions.cadastrarFazenda, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FazendaActions.cadastrarFazendaSuccess, (state, { fazenda }) => ({
    ...state,
    fazendas: [...state.fazendas, fazenda],
    loading: false,
    error: null,
  })),
  on(FazendaActions.cadastrarFazendaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(FazendaActions.resetCadastroFazenda, (state) => ({
    ...state,
    loading: false,
    error: null,
  }))
);
