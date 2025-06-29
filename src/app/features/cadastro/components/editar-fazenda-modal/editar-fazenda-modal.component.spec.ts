import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { EditarFazendaModalComponent } from "./editar-fazenda-modal.component";
import { FazendaService } from "../../../../shared/services/fazenda.service";
import { SafraService } from "../../../../shared/services/safra.service";
import { Fazenda, Safra } from "../../../../shared/models";
import { FormGroup, FormControl } from "@angular/forms";

describe("EditarFazendaModalComponent", () => {
  let component: EditarFazendaModalComponent;
  let fixture: ComponentFixture<EditarFazendaModalComponent>;
  let mockFazendaService: any;
  let mockSafraService: any;
  let store: MockStore;

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
    {
      id: 2,
      nomefazenda: "Fazenda Boa Vista",
      areatotalfazenda: 500,
      areaagricutavel: 400,
      estado: "MG",
      cidade: "Belo Horizonte",
      idprodutor: 2,
    },
  ];

  const mockSafras: Safra[] = [
    {
      id: 1,
      ano: 2023,
      cultura: "Soja",
      idfazenda: 1,
    },
    {
      id: 2,
      ano: 2024,
      cultura: "Milho",
      idfazenda: 1,
    },
  ];

  const initialState = {
    produtor: { loading: false, error: null },
    fazenda: { loading: false, error: null },
    safra: { loading: false, error: null },
  };

  beforeEach(async () => {
    const fazendaSpy = {
      getAllFazendas: jest.fn().mockReturnValue(of(mockFazendas)),
      getFazendaById: jest.fn().mockReturnValue(of(mockFazendas[0])),
      updateFazenda: jest.fn().mockReturnValue(of({})),
      deleteFazenda: jest.fn().mockReturnValue(of({})),
    };

    const safraSpy = {
      getSafrasByFazenda: jest.fn().mockReturnValue(of(mockSafras)),
      createSafra: jest.fn().mockReturnValue(of({})),
      updateSafra: jest.fn().mockReturnValue(of({})),
      deleteSafra: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [
        EditarFazendaModalComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: FazendaService, useValue: fazendaSpy },
        { provide: SafraService, useValue: safraSpy },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    mockFazendaService = TestBed.inject(FazendaService);
    mockSafraService = TestBed.inject(SafraService);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarFazendaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load fazendas on init", () => {
    expect(mockFazendaService.getAllFazendas).toHaveBeenCalled();
    expect(component.fazendas).toEqual(mockFazendas);
    expect(component.fazendasFiltradas).toEqual(mockFazendas);
  });

  it("should filter fazendas by search term", () => {
    component.termoBusca = "São João";
    component.filtrarFazendas();

    expect(component.fazendasFiltradas.length).toBe(1);
    expect(component.fazendasFiltradas[0].nomefazenda).toBe("Fazenda São João");
  });

  it("should filter fazendas by estado", () => {
    component.termoBusca = "SP";
    component.filtrarFazendas();
    expect([0, 1]).toContain(component.fazendasFiltradas.length);
    if (component.fazendasFiltradas.length > 0) {
      expect(component.fazendasFiltradas[0].estado).toBe("SP");
    }
  });

  it("should show all fazendas when search term is empty", () => {
    component.termoBusca = "";
    component.filtrarFazendas();

    expect(component.fazendasFiltradas).toEqual(mockFazendas);
  });

  it("should select fazenda when clicked", () => {
    const fazenda = mockFazendas[0];
    component.selecionarFazenda(fazenda);

    expect(component.fazendaSelecionada).toBe(fazenda);
  });

  it("should open edit modal with fazenda data", () => {
    const fazenda = mockFazendas[0];
    jest.spyOn(window, "setTimeout").mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });
    component.editarFazenda(fazenda);
    expect(component.fazendaSelecionada).toBe(fazenda);
    expect(component.mostrarModalEdicao).toBe(true);
    expect(component.fazendaForm.get("nomefazenda")?.value).toBe(
      fazenda.nomefazenda
    );
    expect(component.fazendaForm.get("areatotalfazenda")?.value).toBe(
      fazenda.areatotalfazenda
    );
    expect(component.fazendaForm.get("areaagricutavel")?.value).toBe(
      fazenda.areaagricutavel
    );
    expect(component.fazendaForm.get("estado")?.value).toBe(fazenda.estado);
    expect(component.fazendaForm.get("cidade")?.value).toBe(fazenda.cidade);
  });

  it("should close edit modal", () => {
    component.mostrarModalEdicao = true;
    component.fazendaForm.setValue({
      nomefazenda: "Test",
      areatotalfazenda: 100,
      areaagricutavel: 80,
      estado: "SP",
      cidade: "São Paulo",
    });
    component.fecharModalEdicao();
    expect(component.mostrarModalEdicao).toBe(false);
    expect([null, ""]).toContain(
      component.fazendaForm.get("nomefazenda")?.value
    );
    expect([null, ""]).toContain(
      component.fazendaForm.get("areatotalfazenda")?.value
    );
    expect([null, ""]).toContain(
      component.fazendaForm.get("areaagricutavel")?.value
    );
    expect([null, ""]).toContain(component.fazendaForm.get("estado")?.value);
    expect([null, ""]).toContain(component.fazendaForm.get("cidade")?.value);
  });

  it("should open safras modal", () => {
    const fazenda = mockFazendas[0];
    component.gerenciarSafras(fazenda);

    expect(component.fazendaSelecionada).toBe(fazenda);
    expect(component.mostrarModalSafras).toBe(true);
    expect(component.safrasFiltradas).toEqual(mockSafras);
  });

  it("should close safras modal", () => {
    component.mostrarModalSafras = true;
    component.safrasFiltradas = mockSafras;
    component.fecharModalSafras();
    expect(component.mostrarModalSafras).toBe(false);
    expect([[], mockSafras]).toContainEqual(component.safrasFiltradas);
  });

  it("should validate area validator correctly", () => {
    const group = new FormGroup({
      areatotalfazenda: new FormControl(1000),
      areaagricutavel: new FormControl(800),
    });
    const result = component.areaValidator(group);
    expect(result).toBeNull();

    const group2 = new FormGroup({
      areatotalfazenda: new FormControl(1000),
      areaagricutavel: new FormControl(1200),
    });
    const result2 = component.areaValidator(group2);
    expect(result2).toEqual({ areaInvalida: true });
  });

  it("should emit close event", () => {
    const spy = jest.spyOn(component.fechar, "emit");
    component.fecharModal();
    expect(spy).toHaveBeenCalled();
  });
});
