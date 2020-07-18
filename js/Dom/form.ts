namespace Dom{

    export class Form{
        public idFormCntr: string;
        public dataObj: Models.Vehiculo;
        public idFormFormato: string;

        constructor(idFormCntr: string){
            this.idFormCntr=idFormCntr;
        }

        private setFormat(tipo: string){
            if(this.idFormFormato!=null)
                document.getElementById(this.idFormFormato).style.display="none"; 
            switch(tipo){
                case 'auto':
                    this.idFormFormato="cntrFormAuto";
                    break;
                case 'camioneta':
                    this.idFormFormato="cntrFormCamioneta"
                    break;
            }
            document.getElementById(this.idFormFormato).style.display="block"; 
        }

        load(jsonObj:Models.Vehiculo){
            this.dataObj=jsonObj;
            if(jsonObj instanceof Models.Auto)
                this.setFormat('auto'); 
            if(jsonObj instanceof Models.Camioneta)
                this.setFormat('camioneta'); 


            var form= Array.from(document.getElementById(this.idFormFormato).childNodes);
            //json= formatoFechaGuion(this.dataObj);
            for(var input of form){
                if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
                    if(Object.keys(this.dataObj).includes((<HTMLInputElement>input).name)){
                        if((<HTMLInputElement>input).type=='radio'){
                            if((<HTMLInputElement>input).value==this.dataObj[(<HTMLInputElement>input).name])
                                (<HTMLInputElement>input).checked=true; 
                        }else
                            (<HTMLInputElement>input).value=this.dataObj[(<HTMLInputElement>input).name];            
                    }           
                }
            }
            this.validarInput();    //para q no figuren los errores de validaciones anteriores
        } 

        loadEmpty(){
            this.dataObj = null;
            this.setFormat((<HTMLSelectElement>document.getElementById("inputTipo")).value);
        }

        nuevo(){
            let tipo=(<HTMLSelectElement>document.getElementById("inputTipo")).value;
            let id= Database.Control.idGenerator();
            console.log('id'+id);
            switch(tipo){
                case 'auto':
                    this.dataObj= new Models.Auto(id,undefined,undefined,undefined,undefined);
                    break;
                case 'camioneta':
                    this.dataObj= new Models.Camioneta(id,undefined,undefined,undefined,undefined);
                    break;
            }
        }
        save(): Models.Vehiculo | boolean{        //recibir un array con los IDs o nodos y recorrer para armar el objeto json
            if(this.validarInput()){
                if(this.dataObj==null)
                    this.nuevo();
                var form= document.getElementById(this.idFormFormato).childNodes;
                for(var input of form){
                    if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
                        if((<HTMLInputElement>input).type=="button" || ((<HTMLInputElement>input).type=='radio' && (<HTMLInputElement>input).checked==false) || (<HTMLInputElement>input).id=="inputId")
                            continue;
                        this.dataObj[(<HTMLInputElement>input).name]=(<HTMLInputElement>input).value;
                    }
                }
                return this.dataObj;                
            }
            return false;
        }
        
        validarInput(){
            let retorno= true;
            var form= Array.from(document.getElementById(this.idFormFormato).childNodes);
            for(var input of form){
                if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
                    if((<HTMLInputElement>input).type=="button" || (<HTMLInputElement>input).id == "inputId")
                        continue;
                    else if((<HTMLInputElement>input).value=="" || ((<HTMLInputElement>input).type=="text" && (<HTMLInputElement>input).value.length<3)){
                        (<HTMLInputElement>input).className="error";      
                        retorno= false;      
                    }
                    else    
                        (<HTMLInputElement>input).className="sinError";  
                }
            }
            return retorno;
        }
    

    }

}