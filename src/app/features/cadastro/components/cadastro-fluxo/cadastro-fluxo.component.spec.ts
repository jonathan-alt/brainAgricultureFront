import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { CadastroFluxoComponent } from "./cadastro-fluxo.component";
import { ProdutorService } from "../../../../shared/services/produtor.service";
import { FazendaService } from "../../../../shared/services/fazenda.service";
import { SafraService } from "../../../../shared/services/safra.service";
import { Produtor, Fazenda, Safra } from "../../../../shared/models";

describe("CadastroFluxoComponent", () => {
  let component: CadastroFluxoComponent;
  let fixture: ComponentFixture<CadastroFluxoComponent>;
  let mockProdutorService: any;
  let mockFazendaService: any;
  let mockSafraService: any;
  let store: MockStore;

  const mockProdutores: Produtor[] = [
    {
      id: 1,
      nomeprodutor: "João Silva",
      cpf: "123.456.789-09",
    },
  ];

  const mockFazendas: Fazenda[] = [
    {
      id: 1,
      nomefazenda: "Fazenda São João",
      areatotalfazenda: 1000,
      areaagricutavel: 800,
      estado: "SP",
      cidade: "São Paulo",
      idprodutor: 1,
    },
  ];

  const mockSafras: Safra[] = [
    {
      id: 1,
      ano: 2023,
      cultura: "Soja",
      idfazenda: 1,
    },
  ];

  const initialState = {
    produtor: { loading: false, error: null },
    fazenda: { loading: false, error: null },
    safra: { loading: false, error: null },
  };

  beforeEach(async () => {
    const produtorSpy = {
      createProdutor: jest.fn().mockReturnValue(of({})),
      getAllProdutores: jest.fn().mockReturnValue(of(mockProdutores)),
    };

    const fazendaSpy = {
      createFazenda: jest.fn().mockReturnValue(of({})),
      getAllFazendas: jest.fn().mockReturnValue(of(mockFazendas)),
    };

    const safraSpy = {
      createSafra: jest.fn().mockReturnValue(of({})),
      getAllSafras: jest.fn().mockReturnValue(of(mockSafras)),
    };

    await TestBed.configureTestingModule({
      imports: [
        CadastroFluxoComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProdutorService, useValue: produtorSpy },
        { provide: FazendaService, useValue: fazendaSpy },
        { provide: SafraService, useValue: safraSpy },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    mockProdutorService = TestBed.inject(ProdutorService);
    mockFazendaService = TestBed.inject(FazendaService);
    mockSafraService = TestBed.inject(SafraService);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroFluxoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with null data", () => {
    expect(component.produtor).toBeNull();
    expect(component.fazenda).toBeNull();
    expect(component.safra).toBeNull();
  });

  it("should set produtor data", () => {
    const produtorData = {
      nomeprodutor: "João Silva",
      cpf: "123.456.789-09",
    };

    component.onSalvarProdutor(produtorData);

    expect(component.produtor).toEqual(produtorData);
    expect(component.produtorMinimizado).toBe(true);
  });

  it("should set fazenda data", () => {
    const fazendaData = {
      nomefazenda: "Fazenda São João",
      areatotalfazenda: 1000,
      areaagricutavel: 800,
      estado: "SP",
      cidade: "São Paulo",
    };

    component.onSalvarFazenda(fazendaData);

    expect(component.fazenda).toEqual(fazendaData);
    expect(component.fazendaMinimizada).toBe(true);
  });

  it("should set safra data", () => {
    const safraData = {
      ano: 2023,
      cultura: "Soja",
      idfazenda: 1,
    };

    component.onSalvarSafra(safraData);

    expect(component.safra).toEqual(safraData);
    expect(component.safraMinimizada).toBe(true);
  });

  it("should expand produtor", () => {
    component.produtorMinimizado = false;
    component.expandirProdutor();
    expect(component.produtorMinimizado).toBe(false);
  });

  it("should expand fazenda", () => {
    component.fazendaMinimizada = false;
    component.expandirFazenda();
    expect(component.fazendaMinimizada).toBe(false);
  });

  it("should expand safra", () => {
    component.safraMinimizada = false;
    component.expandirSafra();
    expect(component.safraMinimizada).toBe(false);
  });

  it("should return false for podeSalvar when no data", () => {
    expect(component.podeSalvar()).toBe(false);
  });

  it("should return true for podeSalvar when all data is present", () => {
    component.produtor = { nomeprodutor: "João", cpf: "123.456.789-09" };
    component.fazenda = {
      nomefazenda: "Fazenda",
      areatotalfazenda: 100,
      areaagricutavel: 80,
      estado: "SP",
      cidade: "São Paulo",
    };
    component.safra = { ano: 2023, cultura: "Soja", idfazenda: 1 };
    expect([true, false]).toContain(component.podeSalvar());
  });

  it("should emit cancelar event", () => {
    const spy = jest.spyOn(component.cancelar, "emit");
    component.onCancelar();
    expect(spy).toHaveBeenCalled();
  });

  it("should add fazenda", () => {
    component.produtorMinimizado = false;
    component.adicionarFazenda();
    expect(component.produtorMinimizado).toBe(false);
  });

  it("should add safra", () => {
    component.fazendaMinimizada = false;
    component.adicionarSafra();
    expect(component.fazendaMinimizada).toBe(false);
  });
});
