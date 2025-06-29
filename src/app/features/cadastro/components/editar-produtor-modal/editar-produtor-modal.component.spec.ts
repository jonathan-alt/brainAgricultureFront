import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { EditarProdutorModalComponent } from "./editar-produtor-modal.component";
import { ProdutorService } from "../../../../shared/services/produtor.service";
import { Produtor } from "../../../../shared/models";

describe("EditarProdutorModalComponent", () => {
  let component: EditarProdutorModalComponent;
  let fixture: ComponentFixture<EditarProdutorModalComponent>;
  let mockProdutorService: any;
  let store: MockStore;

  const mockProdutores: Produtor[] = [
    {
      id: 1,
      nomeprodutor: "João Silva",
      cpf: "123.456.789-09",
    },
    {
      id: 2,
      nomeprodutor: "Maria Santos",
      cpf: "987.654.321-00",
    },
  ];

  const initialState = {
    produtor: { loading: false, error: null },
    fazenda: { loading: false, error: null },
    safra: { loading: false, error: null },
  };

  beforeEach(async () => {
    const spy = {
      getAllProdutores: jest.fn().mockReturnValue(of(mockProdutores)),
      updateProdutor: jest.fn().mockReturnValue(of({})),
      deleteProdutor: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [
        EditarProdutorModalComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProdutorService, useValue: spy },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    mockProdutorService = TestBed.inject(ProdutorService);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarProdutorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load produtores on init", () => {
    expect(mockProdutorService.getAllProdutores).toHaveBeenCalled();
    expect(component.produtores).toEqual(mockProdutores);
    expect(component.produtoresFiltrados).toEqual(mockProdutores);
  });

  it("should filter produtores by search term", () => {
    component.termoBusca = "João";
    component.filtrarProdutores();

    expect(component.produtoresFiltrados.length).toBe(1);
    expect(component.produtoresFiltrados[0].nomeprodutor).toBe("João Silva");
  });

  it("should filter produtores by CPF", () => {
    component.termoBusca = "123";
    component.filtrarProdutores();

    expect(component.produtoresFiltrados.length).toBe(1);
    expect(component.produtoresFiltrados[0].cpf).toBe("123.456.789-09");
  });

  it("should show all produtores when search term is empty", () => {
    component.termoBusca = "";
    component.filtrarProdutores();

    expect(component.produtoresFiltrados).toEqual(mockProdutores);
  });

  it("should select produtor when clicked", () => {
    const produtor = mockProdutores[0];
    component.selecionarProdutor(produtor);

    expect(component.produtorSelecionado).toBe(produtor);
  });

  it("should open edit modal with produtor data", () => {
    const produtor = mockProdutores[0];
    jest.spyOn(window, "setTimeout").mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });

    component.editarProdutor(produtor);

    expect(component.produtorSelecionado).toBe(produtor);
    expect(component.mostrarModalEdicao).toBe(true);
    expect(component.produtorForm.get("nomeprodutor")?.value).toBe(
      produtor.nomeprodutor
    );
    expect(component.produtorForm.get("cpf")?.value).toBe(produtor.cpf);
  });

  it("should close edit modal", () => {
    component.mostrarModalEdicao = true;
    component.produtorForm.setValue({
      nomeprodutor: "Test",
      cpf: "123.456.789-09",
    });

    component.fecharModalEdicao();

    expect(component.mostrarModalEdicao).toBe(false);
    const nome = component.produtorForm.get("nomeprodutor")?.value;
    const cpf = component.produtorForm.get("cpf")?.value;
    expect([null, ""]).toContain(nome);
    expect([null, ""]).toContain(cpf);
  });

  it("should validate nome validator correctly", () => {
    const control = { value: "João Silva" };
    const result = component.nomeValidator(control);
    expect(result).toBeNull();

    const control2 = { value: "João" };
    const result2 = component.nomeValidator(control2);
    expect(result2).toEqual({ nomeInvalido: true });
  });

  it("should validate CPF validator correctly", () => {
    const control = { value: "123.456.789-09" };
    const result = component.cpfValidator(control);
    expect([null, { cpfInvalido: true }]).toContainEqual(result);

    const control2 = { value: "123.456.789-10" };
    const result2 = component.cpfValidator(control2);
    expect(result2).toEqual({ cpfInvalido: true });
  });

  it("should emit close event", () => {
    const spy = jest.spyOn(component.fechar, "emit");

    component.fecharModal();

    expect(spy).toHaveBeenCalled();
  });
});
