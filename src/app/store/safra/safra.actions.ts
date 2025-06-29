import { createAction, props } from "@ngrx/store";
import { Safra, SafraCreate } from "../../shared/models";

export const cadastrarSafra = createAction(
  "[Safra] Cadastrar",
  props<{ safra: SafraCreate }>()
);

export const cadastrarSafraSuccess = createAction(
  "[Safra] Cadastrar Success",
  props<{ safra: Safra }>()
);

export const cadastrarSafraFailure = createAction(
  "[Safra] Cadastrar Failure",
  props<{ error: string }>()
);

export const resetCadastroSafra = createAction("[Safra] Reset Cadastro");
