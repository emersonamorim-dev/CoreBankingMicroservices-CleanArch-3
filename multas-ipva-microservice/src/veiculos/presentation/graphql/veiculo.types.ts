import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class VeiculoType {
  @Field()
  placa: string;

  @Field(() => Int)
  multas: number;

  @Field(() => Int)
  ipva: number;

  @Field(() => Int)
  dividaTotal: number;
}

@ObjectType()
export class ParcelamentoType {
  @Field()
  placa: string;

  @Field(() => Int)
  dividaTotal: number;

  @Field(() => Int)
  numeroParcelas: number;

  @Field(() => Float) 
  valorParcela: number;

  @Field(() => [String])
  formasPagamento: string[];
}
