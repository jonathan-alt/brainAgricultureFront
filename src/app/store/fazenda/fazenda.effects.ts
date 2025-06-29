import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FazendaService } from "../../shared/services/fazenda.service";
import * as FazendaActions from "./fazenda.actions";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class FazendaEffects {
  constructor(
    private actions$: Actions,
    private fazendaService: FazendaService
  ) {}

  cadastrarFazenda$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FazendaActions.cadastrarFazenda),
      mergeMap(({ fazenda }) =>
        this.fazendaService.createFazenda(fazenda).pipe(
          map((response) => {
            if (response.success && response.data) {
              return FazendaActions.cadastrarFazendaSuccess({
                fazenda: { ...fazenda, ...response.data },
              });
            } else {
              return FazendaActions.cadastrarFazendaFailure({
                error: response.message,
              });
            }
          }),
          catchError((error) =>
            of(
              FazendaActions.cadastrarFazendaFailure({
                error: error.message || "Erro ao cadastrar fazenda",
              })
            )
          )
        )
      )
    )
  );
}
