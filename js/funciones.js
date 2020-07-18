window.onload=function(){

    cargarTabla();      //en la fx armarGrilla indicar los elementos q no se muestran
    setBotonCerrar();
    
    //setButtonShowHide("btnAgregar", "cntrForm");
    //document.getElementById("btnGuardar").addEventListener("click",function(){save("cntrForm");});
    document.getElementById("btnModificar").addEventListener("click",function(){modificar("cntrForm");});
    document.getElementById("btnEliminar").addEventListener("click",function(){eliminar("cntrForm");});
}

//propios del ejercicio / server------------------------------------------------------
function cargarTabla(){
    get_httpRequest('http://localhost:3000/personas',function(json){
        armarGrilla(json);
        setShowOnDblClick('td','cntrForm');
        spinner('ocultar');
    });
}
function save(idForm){
    if(validarInput(idForm)){
        post_httpRequest('http://localhost:3000/nuevaPersona',formToJson(idForm),cargarTabla);
        spinner('mostrar');
        return true;
    }
    return false;
}
function modificar(idForm){
    if(validarInput(idForm)){
        var json=formToJson(idForm);
        post_httpRequest('http://localhost:3000/editar',json,function(r){
            if(JSON.parse(r)["type"]=="ok"){
                updateRow(json);  
                setShowOnDblClick('td','cntrForm','rowid'+json['id']);
            }
            document.getElementById('cntrForm').style.display="none";
            spinner('ocultar');
        });
        spinner('mostrar');
        return true;
    }
    console.log('Error de validación');
    return false;
}

function eliminar(idForm){
    var json=formToJson(idForm);
    post_httpRequest('http://localhost:3000/eliminar',json,function(r){
        if(JSON.parse(r)["type"]=="ok")
            deleteRow(json);
        document.getElementById('cntrForm').style.display="none";
        spinner('ocultar');
    });
    spinner('mostrar');
    return true;
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

function formatoFechaGuion(json){
    var fecha=(json["fechaFinal"]).split('/');
    json["fechaFinal"]= fecha[2]+'-'+fecha[1]+'-'+fecha[0];
    return json;
}
function formatoFechaBarra(json){
    var fecha=(json["fechaFinal"]).split('-');
    json["fechaFinal"]= fecha[2]+'/'+fecha[1]+'/'+fecha[0];
    return json;
}


//forms----------------------------------------------------------------------
function formToJson(idForm){        //recibir un array con los IDs o nodos y recorrer para armar el objeto json
    var jsonStr= "{";
    var form= document.getElementById(idForm).childNodes;
    var coma=false;
    for(var input of form){
        if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
            if(input.type=="button" || (input.type=='radio' && input.checked==false))
                continue;
            if(coma==true)
                jsonStr+=',';
            jsonStr+='"'+input.name+'":"'+input.value+'"';
            coma=true;
        }
    }
    jsonStr+='}';
    var jsonObj=JSON.parse(jsonStr);
    return formatoJson(jsonObj);
}

function validarInput(idForm){
    retorno= true;
    var form= document.getElementById(idForm).childNodes;
    for(var input of form){
        if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
            if(input.type=="button")
                continue;
            else if(input.value=="" || (input.type=="text" && input.value.length<6) || (input.type=="date" && Date.parse(input.value)>Date.now())){
                input.className="error";      
                retorno= false;      
            }
            else    
                input.className="sinError";  
        }
    }
    return retorno;
}

function jsonToForm(jsonForm, idForm){
    var form= document.getElementById(idForm).childNodes;
    //json= formatoFechaGuion(jsonForm);
    for(var input of form){
        if(input.nodeName=='SELECT' || input.nodeName=='INPUT'){
            if(Object.keys(json).includes(input.name)){
                if(input.type=='radio'){
                    if(input.value==json[input.name])
                        input.checked='checked';
                }else
                    input.value=json[input.name];            
            }           
        }
    }
    //validarInput(idForm);
}

function tableRowToJson(rowElement){
    return JSON.parse(rowElement.lastChild.innerHTML);
}


//Set eventos-------------------------------------------------------------------
function setBotonCerrar(){
    var botones =document.getElementsByClassName("botonX");
    if(botones.length>0){
        for(var boton of botones){
            boton.addEventListener("click", function(){(this.parentNode).style.display="none";})
        }       
    }
}
function setButtonShowHide(idBoton, idElemento){
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
function setShowOnDblClick(tagElementosClick, idElementoMostrado, idContenedor){
    if(idContenedor==null){
        var arrElemClick =document.getElementsByTagName(tagElementosClick);        
    }else{
        var arrElemClick =document.getElementById(idContenedor).getElementsByTagName(tagElementosClick); 
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
                    jsonToForm(tableRowToJson(this.parentElement), idElementoMostrado); //si no uso this toma siempre el último elemento del array, this es el elemClick que tiene asignado el evento, tmb puedo usar event.target
                }
            });
        }
    }
}


function spinner(accion){
    if(accion=='mostrar'){
        document.getElementById("spinner").style.display="block";      
        document.getElementById("spinnerCntr").style.display="block";      
    }
    else if(accion=='ocultar'){
        document.getElementById("spinner").style.display="none";  
        document.getElementById("spinnerCntr").style.display="none";          
    }
}


//Nodos-------------------------------------------------------------------------
function agregarElemento(tag, idPadre, texto){  //los 3 string
    var nuevoElemento = document.createElement(tag);
    var textNode = document.createTextNode(texto);
    nuevoElemento.appendChild(textNode);
    (document.getElementById(idPadre)).appendChild(nuevoElemento);	// append the new element to an existing element
    return nuevoElemento;
}

function armarGrilla(jsonStr){
    var jsonArr= JSON.parse(jsonStr);
    var i=0;
    document.getElementById('tCuerpo').innerHTML='';    //reemplaza la anterior tabla
    for(var obj of jsonArr){
        agregarElemento('tr','tCuerpo','').id='row'+i;  //agrego fila
        for(var prop in obj){
            if(prop=='id')                              //propiedades que no se muestran en la tabla
                continue;
            agregarElemento('td','row'+i,obj[prop]);    //agrego celdas
        }
        (agregarElemento('td','row'+i,JSON.stringify(obj))).style.display='none';    //guardo el json por si necesito recuperar los nombres de las props
        i++;
    }
}
function updateRow(json){
    var tabla= document.getElementById('tCuerpo').getElementsByTagName('tr');
    for(var fila of tabla){
        jsonTabla=JSON.parse(fila.lastChild.innerHTML);
        if(json['id']==jsonTabla['id']){
            fila.innerHTML='';
            fila.id='rowid'+json['id'];
            for(var prop in json){
                if(prop=='id')                              //propiedades que no se muestran en la tabla
                    continue;
                agregarElemento('td',fila.id,json[prop]);    //agrego celdas
            }
            (agregarElemento('td',fila.id,JSON.stringify(json))).style.display='none';    //guardo el json por si necesito recuperar los nombres de las props
        }
    }
}
function deleteRow(json){
    var tabla= document.getElementById('tCuerpo').getElementsByTagName('tr');
    for(var fila of tabla){
        jsonTabla=JSON.parse(fila.lastChild.innerHTML);
        if(json['id']==jsonTabla['id']){
            document.getElementById('tCuerpo').removeChild(fila);
        }
    }
}

//HTTP request-------------------------------------------------------------------
function get_httpRequest(url, accion){
    var http = new XMLHttpRequest();   
    http.onreadystatechange = function(){ 
        if(this.readyState==4){
            if(this.status==200)  
                accion(this.response);
            else
                console.log("Error HTTP Request");
        } 
    };
    http.open("GET",url, true); 
    http.send(); 
}

function post_httpRequest(url, jsonBody, callback){   
    var http = new XMLHttpRequest();   
    http.onreadystatechange = function(){ 
        if(this.readyState==4){
            if(this.status==200)  //se puede poner en una línea
                callback(this.response);
            else
                console.log("Error HTTP Request");
        } 
    };
    http.open("POST",url, true); 
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(jsonBody)); 
}