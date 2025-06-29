import { FormControl, FormGroup } from "@angular/forms";
import { CustomValidators } from "./validators";

describe("CustomValidators", () => {
  describe("cpfValidator", () => {
    it("should return null for valid CPF", () => {
      const control = new FormControl("123.456.789-09");
      const result = CustomValidators.cpfValidator(control);
      expect(result).toBeNull();
    });

    it("should return error for invalid CPF", () => {
      const control = new FormControl("123.456.789-10");
      const result = CustomValidators.cpfValidator(control);
      expect(result).toEqual({ invalidCpf: true });
    });

    it("should return error for CPF with all same digits", () => {
      const control = new FormControl("111.111.111-11");
      const result = CustomValidators.cpfValidator(control);
      expect(result).toEqual({ invalidCpf: true });
    });

    it("should return error for CPF with less than 11 digits", () => {
      const control = new FormControl("123.456.789");
      const result = CustomValidators.cpfValidator(control);
      expect(result).toEqual({ invalidCpf: true });
    });
  });

  describe("nomeCompletoValidator", () => {
    it("should return null for valid name with 2 words", () => {
      const control = new FormControl("João Silva");
      const result = CustomValidators.nomeCompletoValidator(control);
      expect(result).toBeNull();
    });

    it("should return null for valid name with more than 2 words", () => {
      const control = new FormControl("João da Silva Santos");
      const result = CustomValidators.nomeCompletoValidator(control);
      expect(result).toBeNull();
    });

    it("should return error for name with only one word", () => {
      const control = new FormControl("João");
      const result = CustomValidators.nomeCompletoValidator(control);
      expect(result).toEqual({ nomeIncompleto: true });
    });

    it("should return error for empty name", () => {
      const control = new FormControl("");
      const result = CustomValidators.nomeCompletoValidator(control);
      expect(result).toEqual({ required: true });
    });
  });

  describe("areaValidator", () => {
    it("should return null when area agricultável is less than total", () => {
      const group = new FormGroup({
        areatotalfazenda: new FormControl(100),
        areaagricultavel: new FormControl(80),
      });
      const result = CustomValidators.areaValidator(
        group.get("areaagricultavel")!
      );
      expect(result).toBeNull();
    });

    it("should return null when area agricultável equals total", () => {
      const group = new FormGroup({
        areatotalfazenda: new FormControl(100),
        areaagricultavel: new FormControl(100),
      });
      const result = CustomValidators.areaValidator(
        group.get("areaagricultavel")!
      );
      expect(result).toBeNull();
    });

    it("should return error when area agricultável is greater than total", () => {
      const group = new FormGroup({
        areatotalfazenda: new FormControl(100),
        areaagricultavel: new FormControl(120),
      });
      const result = CustomValidators.areaValidator(
        group.get("areaagricultavel")!
      );
      expect(result).toEqual({ areaInvalida: true });
    });
  });
});
