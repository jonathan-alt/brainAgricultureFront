import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { appReducers } from "./store/app.reducers";
import { AppEffects } from "./store/app.effects";
import { ProdutorEffects } from "./store/produtor/produtor.effects";
import { FazendaEffects } from "./store/fazenda/fazenda.effects";
import { SafraEffects } from "./store/safra/safra.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(appReducers),
    provideEffects(AppEffects, ProdutorEffects, FazendaEffects, SafraEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
    }),
  ],
};
