// /// <reference path="../animales/animales.ts" />

// import Mascota = Animales.Mascota;


window.onload=function(){
    //entry point

    Database.Control.data = [];
    var form1 =  new Dom.Form('cntrForm');
    var tabla1= new Dom.Tabla('tabla1',Database.Control.data,form1,['marca','modelo','precio']);




    //Database abm
    Database.Control.cargarTabla(tabla1); //en la fx armarGrilla indicar los elementos q no se muestran

    function promesa(tabla){
        return new Promise((resolve,reject) =>{
            Dom.spinner('mostrar');

            setTimeout(function(){console.log('3 segundos')
            let rdo =  Database.Control.save(tabla);
            if(rdo)
                resolve();
            else
                reject();   
            },3000);
     
        });
    } 
    document.getElementById("btnGuardar").addEventListener("click",function(){
        Database.Control.save(tabla1);
    });
    document.getElementById("btnModificar").addEventListener("click",function(){
        Database.Control.modificar(tabla1);});
    document.getElementById("btnEliminar").addEventListener("click",function(){
        Database.Control.eliminar(tabla1);});
    
    
    //set eventos
    Dom.setBotonCerrar();
    Dom.setButtonShowHide("btnShow", form1.idFormCntr);
    document.getElementById("inputTipo").addEventListener("change",function(){
        form1.loadEmpty();});
    document.getElementById("btnShow").addEventListener("click",function(){
        form1.loadEmpty();});
    document.getElementById("checkId").addEventListener("change",function(){
        tabla1.armarTabla();});
    document.getElementById("checkMarca").addEventListener("change",function(){
        tabla1.armarTabla();});
    document.getElementById("checkModelo").addEventListener("change",function(){
        tabla1.armarTabla();});
    document.getElementById("checkPrecio").addEventListener("change",function(){
        tabla1.armarTabla();});
    document.getElementById("checkAuto").addEventListener("change",function(){
            tabla1.armarTabla();});
    document.getElementById("checkCamioneta").addEventListener("change",function(){
                tabla1.armarTabla();});


}


// tsc –w --outFile index.js ./*/*.ts