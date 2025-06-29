import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProdutorService } from "../../shared/services/produtor.service";
import * as ProdutorActions from "./produtor.actions";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class ProdutorEffects {
  constructor(
    private actions$: Actions,
    private produtorService: ProdutorService
  ) {}

  cadastrarProdutor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProdutorActions.cadastrarProdutor),
      mergeMap(({ produtor }) =>
        this.produtorService.createProdutor(produtor).pipe(
          map((response) => {
            if (response.success && response.data) {
              return ProdutorActions.cadastrarProdutorSuccess({
                produtor: { ...produtor, ...response.data },
              });
            } else {
              return ProdutorActions.cadastrarProdutorFailure({
                error: response.message,
              });
            }
          }),
          catchError((error) =>
            of(
              ProdutorActions.cadastrarProdutorFailure({
                error: error.message || "Erro ao cadastrar produtor",
              })
            )
          )
        )
      )
    )
  );
}
