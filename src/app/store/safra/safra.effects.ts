import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SafraService } from "../../shared/services/safra.service";
import * as SafraActions from "./safra.actions";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class SafraEffects {
  constructor(
    private actions$: Actions,
    private safraService: SafraService
  ) {}

  cadastrarSafra$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SafraActions.cadastrarSafra),
      mergeMap(({ safra }) =>
        this.safraService.createSafra(safra).pipe(
          map((response) => {
            if (response.success && response.data) {
              return SafraActions.cadastrarSafraSuccess({
                safra: { ...safra, ...response.data },
              });
            } else {
              return SafraActions.cadastrarSafraFailure({
                error: response.message,
              });
            }
          }),
          catchError((error) =>
            of(
              SafraActions.cadastrarSafraFailure({
                error: error.message || "Erro ao cadastrar safra",
              })
            )
          )
        )
      )
    )
  );
}
