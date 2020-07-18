namespace Database{
    //abm con promesas
    export class Control{
        static data: Models.Vehiculo[];

        static idGenerator(){
            if(Control.data.length == 0){
                return 1;                
            }
            else{
                let mayor=Control.data.reduce((prev, value)=>(prev.id>value.id)?prev:value).id; 
                return ++mayor;       
            }

        }

        static updateElemento(jsonObj: Models.Vehiculo){
            let indexObj = this.data.findIndex( item => item['id']==jsonObj['id']);
            Control.data[indexObj]=jsonObj;
        }

        static cargarTabla(tabla: Dom.Tabla){
            tabla.armarTabla();
            Dom.spinner('ocultar');
        }

        static save(tabla: Dom.Tabla){
            tabla.form.dataObj=null;
            var jsonObj=tabla.form.save();
            if(jsonObj){
                Dom.spinner('mostrar');
                Control.data.push(<Models.Vehiculo>jsonObj);
                tabla.cargarContenido();
                document.getElementById(tabla.form.idFormCntr).style.display="none";
                document.getElementById(tabla.form.idFormFormato).style.display="none"; 
                Dom.spinner('ocultar');  
                return true;
            }
            console.log('Error de validación');
            return false;
        }

        static modificar(tabla: Dom.Tabla){
            var jsonObj=tabla.form.save();
            if(jsonObj){
                Control.updateElemento(<Models.Vehiculo>jsonObj);
                tabla.cargarContenido();
                document.getElementById(tabla.form.idFormCntr).style.display="none";
                document.getElementById(tabla.form.idFormFormato).style.display="none"; 
                Dom.spinner('ocultar');  

                //Dom.spinner('mostrar');
                return true;
            }
            console.log('Error de validación');
            return false;
        }

        static eliminar(tabla: Dom.Tabla){
            Control.data= Control.data.filter(item => item['id']!=tabla.form.dataObj.id);
            tabla.dataJsonArr=Control.data;
            tabla.cargarContenido();
            document.getElementById(tabla.form.idFormCntr).style.display="none";
            document.getElementById(tabla.form.idFormFormato).style.display="none";
            Dom.spinner('ocultar');

            //Dom.spinner('mostrar');
            return true;
        }

    }




}