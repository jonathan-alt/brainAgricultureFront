import { createReducer, on } from "@ngrx/store";
import { Safra } from "../../shared/models";
import * as SafraActions from "./safra.actions";

export interface SafraState {
  safras: Safra[];
  loading: boolean;
  error: string | null;
}

export const initialState: SafraState = {
  safras: [],
  loading: false,
  error: null,
};

export const safraReducer = createReducer(
  initialState,
  on(SafraActions.cadastrarSafra, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SafraActions.cadastrarSafraSuccess, (state, { safra }) => ({
    ...state,
    safras: [...state.safras, safra],
    loading: false,
    error: null,
  })),
  on(SafraActions.cadastrarSafraFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(SafraActions.resetCadastroSafra, (state) => ({
    ...state,
    loading: false,
    error: null,
  }))
);
