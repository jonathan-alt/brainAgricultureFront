import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, "");

    if (!cpf) {
      return { required: true };
    }

    if (cpf.length !== 11) {
      return { invalidCpf: true };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return { invalidCpf: true };
    }

    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return { invalidCpf: true };
    }

    return null;
  }

  static nomeCompletoValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const nome = control.value?.trim();

    if (!nome) {
      return { required: true };
    }

    const palavras = nome
      .split(" ")
      .filter((palavra: string) => palavra.length > 0);

    if (palavras.length < 2) {
      return { nomeIncompleto: true };
    }

    return null;
  }

  static areaValidator(control: AbstractControl): ValidationErrors | null {
    const areaTotal = control.parent?.get("areatotalfazenda")?.value;
    const areaAgricultavel = control.value;

    if (areaTotal && areaAgricultavel && areaAgricultavel > areaTotal) {
      return { areaInvalida: true };
    }

    return null;
  }

  static semCaracteresEspeciaisValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const valor = control.value?.trim();

    if (!valor) {
      return null; // Campo vazio não é erro aqui, deixar para required validator
    }

    // Regex que aceita apenas letras, números, espaços e acentos
    // Não aceita: !@#$%^&*()_+-=[]{}|;':",./<>?`~
    const regex = /^[a-zA-ZÀ-ÿ0-9\s]+$/;

    if (!regex.test(valor)) {
      return { caracteresEspeciais: true };
    }

    return null;
  }
}
