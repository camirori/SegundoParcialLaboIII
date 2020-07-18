namespace Dom{

    export class Tabla{
        public encabezados: string[];
        public dataJsonArr: Models.Vehiculo[];  
        public idTable: string;         //<table id="tabla1">
        public form: Dom.Form;

        constructor(idTable: string, dataJson: string | object[], form: Dom.Form){   //es tipo object[]?
            this.idTable=idTable;
            if(typeof dataJson === 'string')
                dataJson= JSON.parse(dataJson);
            this.dataJsonArr=dataJson as Models.Vehiculo[];
            this.setColumnas();
            this.form=form;
        }

/*         armarTabla(dataJson?:string | Models.Model | Models.Model[]){
            if(dataJson != undefined){
                if(typeof dataJson === 'string')    
                    this.dataJsonArr=JSON.parse(dataJson);    
                else if(typeof dataJson === 'object')  
                    this.dataJsonArr.push(dataJson);
                else
                    this.dataJsonArr=dataJson; 
            } */

        setColumnas(){
            let opciones = document.getElementById("cntrCampos").childNodes;
            this.encabezados = [];
            for(var input of opciones){
                if(input.nodeName=='INPUT'){
                    if((<HTMLInputElement>input).type=="checkbox" && (<HTMLInputElement>input).checked==true )
                    this.encabezados.push((<HTMLInputElement>input).value);
                }
            }
        }
        filtrarTipoDato(array: Models.Vehiculo[]){
            let retorno =array;
            let opciones = document.getElementById("cntrTipoAMostrar").childNodes;
            let tipo = [];
            for(var input of opciones){
                if(input.nodeName=='INPUT'){
                    if((<HTMLInputElement>input).type=="checkbox" && (<HTMLInputElement>input).checked==true )
                    tipo.push((<HTMLInputElement>input).value);
                }
            }
            if(!tipo.includes('auto')){
                retorno = retorno.filter(item=>!(item instanceof Models.Auto));
            }
            if(!tipo.includes('camioneta')){
                retorno = retorno.filter(item=>!(item instanceof Models.Camioneta));
            }
            return retorno;

        }

        calcularPromedioPrecio(array: Models.Vehiculo[]){
            /* var promedio = array.reduce((total, current, index,arr)=>{
                (<number>total)+=(<number>current.precio);
                console.log(index +' '+ total + 'No se por que no suma!!');
                return index==(arr.length-1)? <number>total/arr.length : <number>total;
              },0); */
              let promedio =0;
            if(array.length>0){
                let precios= array.map(item=>item.precio);
                let total =  precios.reduce((total,valor)=>{
                    if(total==undefined)
                        total=0;
                    total+=valor;
                    return total;}
                );
                promedio= total/array.length;                
            }

              document.getElementById("promedioPrecio").innerText='$'+promedio;
        }

        armarTabla(dataJson?: Models.Vehiculo | Models.Vehiculo[]){
            if(dataJson != undefined){
                if(dataJson instanceof Models.Vehiculo)    
                    this.dataJsonArr.push(dataJson);  
                else
                    this.dataJsonArr=dataJson; 
            }
            this.setColumnas();
            document.getElementById(this.idTable).innerHTML='';    //reemplaza la anterior tabla
            //encabezado
            Dom.agregarElemento('thead',this.idTable,'').id=this.idTable+'-thead'; 
            Dom.agregarElemento('tr',this.idTable+'-thead','').id=this.idTable+'-tr';  
            for(let encabezado of this.encabezados){
                Dom.agregarElemento('th',this.idTable+'-tr',encabezado+'  ').id=this.idTable+'-th-'+encabezado;
            }
            //cuerpo
            Dom.agregarElemento('tbody',this.idTable,'').id=this.idTable+'-tbody';  
            this.cargarContenido();

            this.filtros();
        }

        agregarElemento(elemento: Models.Vehiculo){
            this.dataJsonArr.push(elemento);
            this.cargarContenido();
        }

        cargarContenido(dataArr?:Models.Vehiculo[]){
            if(dataArr==undefined)
                dataArr=this.dataJsonArr;
            this.calcularPromedioPrecio(dataArr);
            dataArr = this.filtrarTipoDato(dataArr);
            document.getElementById(this.idTable+'-tbody').innerHTML='';
            for(var obj of dataArr){
                Dom.agregarElemento('tr',this.idTable+'-tbody','').id=this.idTable+'-row-'+obj['id'];  //agrego fila
                //for(var prop in obj){
                for(let encabezado of this.encabezados){
                    //if(this.encabezados.includes(prop))                              //no agrego propiedades que no se muestran en la tabla
                    Dom.agregarElemento('td',this.idTable+'-row-'+obj['id'],obj[encabezado]);    //agrego celdas
                }
            }
            let tabla = this;
            Dom.setShowOnDblClick('td',this.idTable,this.form.idFormCntr,function(rowSeleccionado){
                tabla.form.load(tabla.tableRowToJsonObj(rowSeleccionado.parentElement));
            });
        }

        filtros(){
            let tabla = this;
            for(let encabezado of this.encabezados){
                let box = <HTMLInputElement>Dom.agregarElemento('input',this.idTable+'-th-'+encabezado);  
                box.type='text';
                box.value="Buscar";
                box.addEventListener("click",()=>box.value='');
                box.addEventListener("blur",()=>box.value='Buscar');
                box.addEventListener("keyup",function(){
                    tabla.cargarContenido(tabla.dataJsonArr.filter(item=>item[encabezado].toLowerCase().includes(box.value.toLowerCase())));                    
                });
            }
        }

        updateRow(jsonObj: Models.Vehiculo): void{
            let indexObj = this.dataJsonArr.findIndex( item => item['id']==jsonObj['id']);
            let fila= document.getElementById(this.idTable+'-row-'+jsonObj['id']);
            fila.innerHTML='';                    
            for(let encabezado of this.encabezados){
                (this.dataJsonArr[indexObj])[encabezado]=jsonObj[encabezado];
                if(this.encabezados.includes(encabezado))                              //no agrego propiedades que no se muestran en la tabla
                    Dom.agregarElemento('td',this.idTable+'-row-'+jsonObj['id'],jsonObj[encabezado]);    //agrego celdas
            }
            let tabla = this;
            Dom.setShowOnDblClick('td',tabla.idTable+'-row-'+jsonObj['id'],tabla.form.idFormCntr,function(rowSeleccionado){
                tabla.form.load(tabla.tableRowToJsonObj(rowSeleccionado.parentElement));
            });
        }

        deleteRow(idObj: string | number): void{
            let fila= document.getElementById(this.idTable+'-row-'+idObj);
            document.getElementById(this.idTable+'-tbody').removeChild(fila);
            this.dataJsonArr= this.dataJsonArr.filter(item => item['id']!=idObj);
        }


        tableRowToJsonObj(rowElement): Models.Vehiculo{
            let idObj=((rowElement.id).split('-'))[2];
            for(let obj of this.dataJsonArr){
                if(obj['id']==idObj){
                    return obj;                    
                }

            }
        }

    }
}