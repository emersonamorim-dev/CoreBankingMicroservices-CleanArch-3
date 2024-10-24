export class Veiculo {
    constructor(
      public placa: string,
      public multas: number,
      public ipva: number,
      //public dividaTotal: number,
      public idProprietario: string,
    ) {}
  
    public obterDividaTotal(): number {
      return this.multas + this.ipva;
    }
  }
  

