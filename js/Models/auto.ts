/// <reference path="./vehiculo.ts" />
namespace Models{
    export class Auto extends Models.Vehiculo{
        cantidadPuertas: number;

        constructor(id: number, marca?:string, modelo?: string, precio?: number, cantidadPuertas?: number){
            super(id,marca,modelo,precio);
            this.cantidadPuertas=cantidadPuertas;
        }
    }
}