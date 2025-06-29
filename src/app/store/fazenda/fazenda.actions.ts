import { createAction, props } from "@ngrx/store";
import { Fazenda, FazendaCreate } from "../../shared/models";

export const cadastrarFazenda = createAction(
  "[Fazenda] Cadastrar",
  props<{ fazenda: FazendaCreate }>()
);

export const cadastrarFazendaSuccess = createAction(
  "[Fazenda] Cadastrar Success",
  props<{ fazenda: Fazenda }>()
);

export const cadastrarFazendaFailure = createAction(
  "[Fazenda] Cadastrar Failure",
  props<{ error: string }>()
);

export const resetCadastroFazenda = createAction("[Fazenda] Reset Cadastro");
