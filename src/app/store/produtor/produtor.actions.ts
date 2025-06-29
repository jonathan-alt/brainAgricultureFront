import { createAction, props } from "@ngrx/store";
import { Produtor, ProdutorCreate } from "../../shared/models";

export const cadastrarProdutor = createAction(
  "[Produtor] Cadastrar",
  props<{ produtor: ProdutorCreate }>()
);

export const cadastrarProdutorSuccess = createAction(
  "[Produtor] Cadastrar Success",
  props<{ produtor: Produtor }>()
);

export const cadastrarProdutorFailure = createAction(
  "[Produtor] Cadastrar Failure",
  props<{ error: string }>()
);

export const resetCadastroProdutor = createAction("[Produtor] Reset Cadastro");
