/// <reference path="./vehiculo.ts" />
namespace Models{
    export class Camioneta extends Models.Vehiculo{
        cuatroXcuatro: number;

        constructor(id: number, marca:string, modelo: string, precio: number, cuatroXcuatro: number){
            super(id,marca,modelo,precio);
            this.cuatroXcuatro=cuatroXcuatro;
        }
    }
}