namespace Dom{

    //armar clase nodos?
    export function agregarElemento(tag: string, idPadre: string, texto?: string): Element{  //los 3 string
        var nuevoElemento = document.createElement(tag);
        var textNode = document.createTextNode(texto);
        nuevoElemento.appendChild(textNode);
        (document.getElementById(idPadre)).appendChild(nuevoElemento);	// append the new element to an existing element
        return nuevoElemento;
    }
    

    export function setBotonCerrar():void{
        var botones =document.getElementsByClassName("botonX");
        if(botones.length>0){
            for(var boton of botones){
                boton.addEventListener("click", function(){(this.parentNode).style.display="none";})
            }       
        }
    }
    
    export function setButtonShowHide(idBoton, idElemento){
        var boton =document.getElementById(idBoton);
        var elemento =document.getElementById(idElemento);
        elemento.style.display="none";
        boton.addEventListener("click", function(){
            if(elemento.style.display!="none")
                elemento.style.display="none";
            else
                elemento.style.display="block";
        });
    }

    export function setShowOnDblClick(tagElementosClick, idContenedorClick, idElementoMostrado, callback){
        if(idContenedorClick==null){
            var arrElemClick =document.getElementsByTagName(tagElementosClick);        
        }else{
            var arrElemClick =document.getElementById(idContenedorClick).getElementsByTagName(tagElementosClick); 
        }
        var elemMostrado =document.getElementById(idElementoMostrado);
        elemMostrado.style.display="none";
        if(arrElemClick.length>0){
            for(var elemClick of arrElemClick){
                elemClick.addEventListener("dblclick", function(){
                    if(elemMostrado.style.display!="none")
                        elemMostrado.style.display="none";
                    else{
                        elemMostrado.style.display="block"; 
                        callback(this); //si no uso this toma siempre el último elemento del array, this es el elemClick que tiene asignado el evento, tmb puedo usar event.target
                    }
                });
            }
        }
    }
    
    
    export function spinner(accion: string){
        if(accion=='mostrar'){
            document.getElementById("spinner").style.display="block";      
            document.getElementById("spinnerCntr").style.display="block";      
        }
        else if(accion=='ocultar'){
            document.getElementById("spinner").style.display="none";  
            document.getElementById("spinnerCntr").style.display="none";          
        }
    }

    export function formatoFechaGuion(json){
        var fecha=(json["fechaFinal"]).split('/');
        json["fechaFinal"]= fecha[2]+'-'+fecha[1]+'-'+fecha[0];
        return json;
    }
    
    export function formatoFechaBarra(json){
        var fecha=(json["fechaFinal"]).split('-');
        json["fechaFinal"]= fecha[2]+'/'+fecha[1]+'/'+fecha[0];
        return json;
    }

    function formatoJson(json){     //o que reciba tmb un array con las props
        /* var jsonObjFinal= {"nombre":"","apellido":"","fecha":"","telefono":""};
        for(var prop of Object.keys(jsonObjFinal)){
            if(prop=="fecha")
                jsonObjFinal[prop]= json[prop].replace(/-/g,'/');
            else if(!isNaN(json[prop])){
                json[prop]=parseInt(json[prop]);             
            }
            else
                jsonObjFinal[prop]=json[prop];
        }
        console.log(jsonObjFinal);
        return jsonObjFinal; */
        return json;
    }

}