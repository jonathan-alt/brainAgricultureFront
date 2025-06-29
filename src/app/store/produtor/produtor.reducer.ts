import { createReducer, on } from "@ngrx/store";
import { Produtor, ProdutorResumido } from "../../shared/models";
import * as ProdutorActions from "./produtor.actions";

export interface ProdutorState {
  produtores: Produtor[];
  produtoresResumidos: ProdutorResumido[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProdutorState = {
  produtores: [],
  produtoresResumidos: [],
  loading: false,
  error: null,
};

export const produtorReducer = createReducer(
  initialState,
  on(ProdutorActions.cadastrarProdutor, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProdutorActions.cadastrarProdutorSuccess, (state, { produtor }) => ({
    ...state,
    produtores: [...state.produtores, produtor],
    loading: false,
    error: null,
  })),
  on(ProdutorActions.cadastrarProdutorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProdutorActions.resetCadastroProdutor, (state) => ({
    ...state,
    loading: false,
    error: null,
  }))
);
