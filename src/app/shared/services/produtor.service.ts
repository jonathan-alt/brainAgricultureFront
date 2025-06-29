import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {
  Produtor,
  ProdutorCreate,
  ProdutorResumido,
  ReturnSuccess,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class ProdutorService extends ApiService {
  getAllProdutores(): Observable<Produtor[]> {
    return this.get<Produtor[]>("/produtores");
  }

  getProdutoresResumidos(): Observable<ProdutorResumido[]> {
    return this.get<ProdutorResumido[]>("/produtores/lista");
  }

  getProdutorById(id: number): Observable<Produtor> {
    return this.get<Produtor>(`/produtores/${id}`);
  }

  createProdutor(produtor: ProdutorCreate): Observable<ReturnSuccess> {
    return this.post<ReturnSuccess>("/produtores", produtor);
  }

  updateProdutor(
    id: number,
    produtor: ProdutorCreate
  ): Observable<ReturnSuccess> {
    return this.put<ReturnSuccess>(`/produtores/${id}`, produtor);
  }

  deleteProdutor(id: number): Observable<ReturnSuccess> {
    return this.delete<ReturnSuccess>(`/produtores/${id}`);
  }

  getProdutorCompleto(id: number): Observable<Produtor> {
    return this.get<Produtor>(`/produtores/${id}/completo`);
  }
}
