import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Safra, SafraCreate, ReturnSuccess } from "../models";

@Injectable({
  providedIn: "root",
})
export class SafraService extends ApiService {
  getAllSafras(): Observable<Safra[]> {
    return this.get<Safra[]>("/safras");
  }

  getSafraById(id: number): Observable<Safra> {
    return this.get<Safra>(`/safras/${id}`);
  }

  getSafrasByFazenda(fazendaId: number): Observable<Safra[]> {
    return this.get<Safra[]>(`/fazendas/${fazendaId}/safras`);
  }

  getSafrasByAno(ano: number): Observable<Safra[]> {
    return this.get<Safra[]>(`/safras/ano/${ano}`);
  }

  createSafra(safra: SafraCreate): Observable<ReturnSuccess> {
    return this.post<ReturnSuccess>("/safras", safra);
  }

  updateSafra(id: number, safra: SafraCreate): Observable<ReturnSuccess> {
    return this.put<ReturnSuccess>(`/safras/${id}`, safra);
  }

  deleteSafra(id: number): Observable<ReturnSuccess> {
    return this.delete<ReturnSuccess>(`/safras/${id}`);
  }
}
