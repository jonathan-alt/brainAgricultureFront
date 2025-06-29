import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { ProdutorEffects } from "./produtor/produtor.effects";
import { FazendaEffects } from "./fazenda/fazenda.effects";
import { SafraEffects } from "./safra/safra.effects";

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private produtorEffects: ProdutorEffects,
    private fazendaEffects: FazendaEffects,
    private safraEffects: SafraEffects
  ) {}
}
