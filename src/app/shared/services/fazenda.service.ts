import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {
  Fazenda,
  FazendaCreate,
  FazendaResumida,
  ReturnSuccess,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class FazendaService extends ApiService {
  getAllFazendas(): Observable<Fazenda[]> {
    return this.get<Fazenda[]>("/fazendas");
  }

  getFazendasResumidas(): Observable<FazendaResumida[]> {
    return this.get<FazendaResumida[]>("/fazendas/lista");
  }

  getFazendaById(id: number): Observable<Fazenda> {
    return this.get<Fazenda>(`/fazendas/${id}`);
  }

  getFazendasByProdutor(produtorId: number): Observable<Fazenda[]> {
    return this.get<Fazenda[]>(`/produtores/${produtorId}/fazendas`);
  }

  createFazenda(fazenda: FazendaCreate): Observable<ReturnSuccess> {
    return this.post<ReturnSuccess>("/fazendas", fazenda);
  }

  updateFazenda(id: number, fazenda: FazendaCreate): Observable<ReturnSuccess> {
    return this.put<ReturnSuccess>(`/fazendas/${id}`, fazenda);
  }

  deleteFazenda(id: number): Observable<ReturnSuccess> {
    return this.delete<ReturnSuccess>(`/fazendas/${id}`);
  }

  getFazendaCompleta(id: number): Observable<Fazenda> {
    return this.get<Fazenda>(`/fazendas/${id}/completa`);
  }

  vincularFazendaProdutor(
    fazendaId: number,
    produtorId: number
  ): Observable<ReturnSuccess> {
    return this.post<ReturnSuccess>("/vincular-fazenda-produtor", {
      fazenda_id: fazendaId,
      produtor_id: produtorId,
    });
  }
}
