var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Database;
(function (Database) {
    //abm con promesas
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.idGenerator = function () {
            if (Control.data.length == 0) {
                return 1;
            }
            else {
                var mayor = Control.data.reduce(function (prev, value) { return (prev.id > value.id) ? prev : value; }).id;
                return ++mayor;
            }
        };
        Control.updateElemento = function (jsonObj) {
            var indexObj = this.data.findIndex(function (item) { return item['id'] == jsonObj['id']; });
            Control.data[indexObj] = jsonObj;
        };
        Control.cargarTabla = function (tabla) {
            tabla.armarTabla();
            Dom.spinner('ocultar');
        };
        Control.save = function (tabla) {
            tabla.form.dataObj = null;
            var jsonObj = tabla.form.save();
            if (jsonObj) {
                Dom.spinner('mostrar');
                Control.data.push(jsonObj);
                tabla.cargarContenido();
                document.getElementById(tabla.form.idFormCntr).style.display = "none";
                document.getElementById(tabla.form.idFormFormato).style.display = "none";
                Dom.spinner('ocultar');
                return true;
            }
            console.log('Error de validación');
            return false;
        };
        Control.modificar = function (tabla) {
            var jsonObj = tabla.form.save();
            if (jsonObj) {
                Control.updateElemento(jsonObj);
                tabla.cargarContenido();
                document.getElementById(tabla.form.idFormCntr).style.display = "none";
                document.getElementById(tabla.form.idFormFormato).style.display = "none";
                Dom.spinner('ocultar');
                //Dom.spinner('mostrar');
                return true;
            }
            console.log('Error de validación');
            return false;
        };
        Control.eliminar = function (tabla) {
            Control.data = Control.data.filter(function (item) { return item['id'] != tabla.form.dataObj.id; });
            tabla.dataJsonArr = Control.data;
            tabla.cargarContenido();
            document.getElementById(tabla.form.idFormCntr).style.display = "none";
            document.getElementById(tabla.form.idFormFormato).style.display = "none";
            Dom.spinner('ocultar');
            //Dom.spinner('mostrar');
            return true;
        };
        return Control;
    }());
    Database.Control = Control;
})(Database || (Database = {}));
var Dom;
(function (Dom) {
    var Form = /** @class */ (function () {
        function Form(idFormCntr) {
            this.idFormCntr = idFormCntr;
        }
        Form.prototype.setFormat = function (tipo) {
            if (this.idFormFormato != null)
                document.getElementById(this.idFormFormato).style.display = "none";
            switch (tipo) {
                case 'auto':
                    this.idFormFormato = "cntrFormAuto";
                    break;
                case 'camioneta':
                    this.idFormFormato = "cntrFormCamioneta";
                    break;
            }
            document.getElementById(this.idFormFormato).style.display = "block";
        };
        Form.prototype.load = function (jsonObj) {
            this.dataObj = jsonObj;
            if (jsonObj instanceof Models.Auto)
                this.setFormat('auto');
            if (jsonObj instanceof Models.Camioneta)
                this.setFormat('camioneta');
            var form = Array.from(document.getElementById(this.idFormFormato).childNodes);
            //json= formatoFechaGuion(this.dataObj);
            for (var _i = 0, form_1 = form; _i < form_1.length; _i++) {
                var input = form_1[_i];
                if (input.nodeName == 'SELECT' || input.nodeName == 'INPUT') {
                    if (Object.keys(this.dataObj).includes(input.name)) {
                        if (input.type == 'radio') {
                            if (input.value == this.dataObj[input.name])
                                input.checked = true;
                        }
                        else
                            input.value = this.dataObj[input.name];
                    }
                }
            }
            this.validarInput(); //para q no figuren los errores de validaciones anteriores
        };
        Form.prototype.loadEmpty = function () {
            this.dataObj = null;
            this.setFormat(document.getElementById("inputTipo").value);
        };
        Form.prototype.nuevo = function () {
            var tipo = document.getElementById("inputTipo").value;
            var id = Database.Control.idGenerator();
            console.log('id' + id);
            switch (tipo) {
                case 'auto':
                    this.dataObj = new Models.Auto(id, undefined, undefined, undefined, undefined);
                    break;
                case 'camioneta':
                    this.dataObj = new Models.Camioneta(id, undefined, undefined, undefined, undefined);
                    break;
            }
        };
        Form.prototype.save = function () {
            if (this.validarInput()) {
                if (this.dataObj == null)
                    this.nuevo();
                var form = document.getElementById(this.idFormFormato).childNodes;
                for (var _i = 0, form_2 = form; _i < form_2.length; _i++) {
                    var input = form_2[_i];
                    if (input.nodeName == 'SELECT' || input.nodeName == 'INPUT') {
                        if (input.type == "button" || (input.type == 'radio' && input.checked == false) || input.id == "inputId")
                            continue;
                        this.dataObj[input.name] = input.value;
                    }
                }
                return this.dataObj;
            }
            return false;
        };
        Form.prototype.validarInput = function () {
            var retorno = true;
            var form = Array.from(document.getElementById(this.idFormFormato).childNodes);
            for (var _i = 0, form_3 = form; _i < form_3.length; _i++) {
                var input = form_3[_i];
                if (input.nodeName == 'SELECT' || input.nodeName == 'INPUT') {
                    if (input.type == "button" || input.id == "inputId")
                        continue;
                    else if (input.value == "" || (input.type == "text" && input.value.length < 3)) {
                        input.className = "error";
                        retorno = false;
                    }
                    else
                        input.className = "sinError";
                }
            }
            return retorno;
        };
        return Form;
    }());
    Dom.Form = Form;
})(Dom || (Dom = {}));
var Dom;
(function (Dom) {
    //armar clase nodos?
    function agregarElemento(tag, idPadre, texto) {
        var nuevoElemento = document.createElement(tag);
        var textNode = document.createTextNode(texto);
        nuevoElemento.appendChild(textNode);
        (document.getElementById(idPadre)).appendChild(nuevoElemento); // append the new element to an existing element
        return nuevoElemento;
    }
    Dom.agregarElemento = agregarElemento;
    function setBotonCerrar() {
        var botones = document.getElementsByClassName("botonX");
        if (botones.length > 0) {
            for (var _i = 0, botones_1 = botones; _i < botones_1.length; _i++) {
                var boton = botones_1[_i];
                boton.addEventListener("click", function () { (this.parentNode).style.display = "none"; });
            }
        }
    }
    Dom.setBotonCerrar = setBotonCerrar;
    function setButtonShowHide(idBoton, idElemento) {
        var boton = document.getElementById(idBoton);
        var elemento = document.getElementById(idElemento);
        elemento.style.display = "none";
        boton.addEventListener("click", function () {
            if (elemento.style.display != "none")
                elemento.style.display = "none";
            else
                elemento.style.display = "block";
        });
    }
    Dom.setButtonShowHide = setButtonShowHide;
    function setShowOnDblClick(tagElementosClick, idContenedorClick, idElementoMostrado, callback) {
        if (idContenedorClick == null) {
            var arrElemClick = document.getElementsByTagName(tagElementosClick);
        }
        else {
            var arrElemClick = document.getElementById(idContenedorClick).getElementsByTagName(tagElementosClick);
        }
        var elemMostrado = document.getElementById(idElementoMostrado);
        elemMostrado.style.display = "none";
        if (arrElemClick.length > 0) {
            for (var _i = 0, arrElemClick_1 = arrElemClick; _i < arrElemClick_1.length; _i++) {
                var elemClick = arrElemClick_1[_i];
                elemClick.addEventListener("dblclick", function () {
                    if (elemMostrado.style.display != "none")
                        elemMostrado.style.display = "none";
                    else {
                        elemMostrado.style.display = "block";
                        callback(this); //si no uso this toma siempre el último elemento del array, this es el elemClick que tiene asignado el evento, tmb puedo usar event.target
                    }
                });
            }
        }
    }
    Dom.setShowOnDblClick = setShowOnDblClick;
    function spinner(accion) {
        if (accion == 'mostrar') {
            document.getElementById("spinner").style.display = "block";
            document.getElementById("spinnerCntr").style.display = "block";
        }
        else if (accion == 'ocultar') {
            document.getElementById("spinner").style.display = "none";
            document.getElementById("spinnerCntr").style.display = "none";
        }
    }
    Dom.spinner = spinner;
    function formatoFechaGuion(json) {
        var fecha = (json["fechaFinal"]).split('/');
        json["fechaFinal"] = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
        return json;
    }
    Dom.formatoFechaGuion = formatoFechaGuion;
    function formatoFechaBarra(json) {
        var fecha = (json["fechaFinal"]).split('-');
        json["fechaFinal"] = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
        return json;
    }
    Dom.formatoFechaBarra = formatoFechaBarra;
    function formatoJson(json) {
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
})(Dom || (Dom = {}));
var Dom;
(function (Dom) {
    var Tabla = /** @class */ (function () {
        function Tabla(idTable, dataJson, form) {
            this.idTable = idTable;
            if (typeof dataJson === 'string')
                dataJson = JSON.parse(dataJson);
            this.dataJsonArr = dataJson;
            this.setColumnas();
            this.form = form;
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
        Tabla.prototype.setColumnas = function () {
            var opciones = document.getElementById("cntrCampos").childNodes;
            this.encabezados = [];
            for (var _i = 0, opciones_1 = opciones; _i < opciones_1.length; _i++) {
                var input = opciones_1[_i];
                if (input.nodeName == 'INPUT') {
                    if (input.type == "checkbox" && input.checked == true)
                        this.encabezados.push(input.value);
                }
            }
        };
        Tabla.prototype.filtrarTipoDato = function (array) {
            var retorno = array;
            var opciones = document.getElementById("cntrTipoAMostrar").childNodes;
            var tipo = [];
            for (var _i = 0, opciones_2 = opciones; _i < opciones_2.length; _i++) {
                var input = opciones_2[_i];
                if (input.nodeName == 'INPUT') {
                    if (input.type == "checkbox" && input.checked == true)
                        tipo.push(input.value);
                }
            }
            if (!tipo.includes('auto')) {
                retorno = retorno.filter(function (item) { return !(item instanceof Models.Auto); });
            }
            if (!tipo.includes('camioneta')) {
                retorno = retorno.filter(function (item) { return !(item instanceof Models.Camioneta); });
            }
            return retorno;
        };
        Tabla.prototype.calcularPromedioPrecio = function (array) {
            /* var promedio = array.reduce((total, current, index,arr)=>{
                (<number>total)+=(<number>current.precio);
                console.log(index +' '+ total + 'No se por que no suma!!');
                return index==(arr.length-1)? <number>total/arr.length : <number>total;
              },0); */
            var promedio = 0;
            if (array.length > 0) {
                var precios = array.map(function (item) { return item.precio; });
                var total = precios.reduce(function (total, valor) {
                    if (total == undefined)
                        total = 0;
                    total += valor;
                    return total;
                });
                promedio = total / array.length;
            }
            document.getElementById("promedioPrecio").innerText = '$' + promedio;
        };
        Tabla.prototype.armarTabla = function (dataJson) {
            if (dataJson != undefined) {
                if (dataJson instanceof Models.Vehiculo)
                    this.dataJsonArr.push(dataJson);
                else
                    this.dataJsonArr = dataJson;
            }
            this.setColumnas();
            document.getElementById(this.idTable).innerHTML = ''; //reemplaza la anterior tabla
            //encabezado
            Dom.agregarElemento('thead', this.idTable, '').id = this.idTable + '-thead';
            Dom.agregarElemento('tr', this.idTable + '-thead', '').id = this.idTable + '-tr';
            for (var _i = 0, _a = this.encabezados; _i < _a.length; _i++) {
                var encabezado = _a[_i];
                Dom.agregarElemento('th', this.idTable + '-tr', encabezado + '  ').id = this.idTable + '-th-' + encabezado;
            }
            //cuerpo
            Dom.agregarElemento('tbody', this.idTable, '').id = this.idTable + '-tbody';
            this.cargarContenido();
            this.filtros();
        };
        Tabla.prototype.agregarElemento = function (elemento) {
            this.dataJsonArr.push(elemento);
            this.cargarContenido();
        };
        Tabla.prototype.cargarContenido = function (dataArr) {
            if (dataArr == undefined)
                dataArr = this.dataJsonArr;
            this.calcularPromedioPrecio(dataArr);
            dataArr = this.filtrarTipoDato(dataArr);
            document.getElementById(this.idTable + '-tbody').innerHTML = '';
            for (var _i = 0, dataArr_1 = dataArr; _i < dataArr_1.length; _i++) {
                var obj = dataArr_1[_i];
                Dom.agregarElemento('tr', this.idTable + '-tbody', '').id = this.idTable + '-row-' + obj['id']; //agrego fila
                //for(var prop in obj){
                for (var _a = 0, _b = this.encabezados; _a < _b.length; _a++) {
                    var encabezado = _b[_a];
                    //if(this.encabezados.includes(prop))                              //no agrego propiedades que no se muestran en la tabla
                    Dom.agregarElemento('td', this.idTable + '-row-' + obj['id'], obj[encabezado]); //agrego celdas
                }
            }
            var tabla = this;
            Dom.setShowOnDblClick('td', this.idTable, this.form.idFormCntr, function (rowSeleccionado) {
                tabla.form.load(tabla.tableRowToJsonObj(rowSeleccionado.parentElement));
            });
        };
        Tabla.prototype.filtros = function () {
            var tabla = this;
            var _loop_1 = function (encabezado) {
                var box = Dom.agregarElemento('input', this_1.idTable + '-th-' + encabezado);
                box.type = 'text';
                box.value = "Buscar";
                box.addEventListener("click", function () { return box.value = ''; });
                box.addEventListener("blur", function () { return box.value = 'Buscar'; });
                box.addEventListener("keyup", function () {
                    tabla.cargarContenido(tabla.dataJsonArr.filter(function (item) { return item[encabezado].toLowerCase().includes(box.value.toLowerCase()); }));
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = this.encabezados; _i < _a.length; _i++) {
                var encabezado = _a[_i];
                _loop_1(encabezado);
            }
        };
        Tabla.prototype.updateRow = function (jsonObj) {
            var indexObj = this.dataJsonArr.findIndex(function (item) { return item['id'] == jsonObj['id']; });
            var fila = document.getElementById(this.idTable + '-row-' + jsonObj['id']);
            fila.innerHTML = '';
            for (var _i = 0, _a = this.encabezados; _i < _a.length; _i++) {
                var encabezado = _a[_i];
                (this.dataJsonArr[indexObj])[encabezado] = jsonObj[encabezado];
                if (this.encabezados.includes(encabezado)) //no agrego propiedades que no se muestran en la tabla
                    Dom.agregarElemento('td', this.idTable + '-row-' + jsonObj['id'], jsonObj[encabezado]); //agrego celdas
            }
            var tabla = this;
            Dom.setShowOnDblClick('td', tabla.idTable + '-row-' + jsonObj['id'], tabla.form.idFormCntr, function (rowSeleccionado) {
                tabla.form.load(tabla.tableRowToJsonObj(rowSeleccionado.parentElement));
            });
        };
        Tabla.prototype.deleteRow = function (idObj) {
            var fila = document.getElementById(this.idTable + '-row-' + idObj);
            document.getElementById(this.idTable + '-tbody').removeChild(fila);
            this.dataJsonArr = this.dataJsonArr.filter(function (item) { return item['id'] != idObj; });
        };
        Tabla.prototype.tableRowToJsonObj = function (rowElement) {
            var idObj = ((rowElement.id).split('-'))[2];
            for (var _i = 0, _a = this.dataJsonArr; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj['id'] == idObj) {
                    return obj;
                }
            }
        };
        return Tabla;
    }());
    Dom.Tabla = Tabla;
})(Dom || (Dom = {}));
var Models;
(function (Models) {
    var Vehiculo = /** @class */ (function () {
        function Vehiculo(id, marca, modelo, precio) {
            this.id = id;
            this.marca = marca;
            this.modelo = modelo;
            this.precio = precio;
        }
        return Vehiculo;
    }());
    Models.Vehiculo = Vehiculo;
})(Models || (Models = {}));
/// <reference path="./vehiculo.ts" />
var Models;
(function (Models) {
    var Auto = /** @class */ (function (_super) {
        __extends(Auto, _super);
        function Auto(id, marca, modelo, precio, cantidadPuertas) {
            var _this = _super.call(this, id, marca, modelo, precio) || this;
            _this.cantidadPuertas = cantidadPuertas;
            return _this;
        }
        return Auto;
    }(Models.Vehiculo));
    Models.Auto = Auto;
})(Models || (Models = {}));
/// <reference path="./vehiculo.ts" />
var Models;
(function (Models) {
    var Camioneta = /** @class */ (function (_super) {
        __extends(Camioneta, _super);
        function Camioneta(id, marca, modelo, precio, cuatroXcuatro) {
            var _this = _super.call(this, id, marca, modelo, precio) || this;
            _this.cuatroXcuatro = cuatroXcuatro;
            return _this;
        }
        return Camioneta;
    }(Models.Vehiculo));
    Models.Camioneta = Camioneta;
})(Models || (Models = {}));
// /// <reference path="../animales/animales.ts" />
// import Mascota = Animales.Mascota;
window.onload = function () {
    //entry point
    Database.Control.data = [];
    var form1 = new Dom.Form('cntrForm');
    var tabla1 = new Dom.Tabla('tabla1', Database.Control.data, form1, ['marca', 'modelo', 'precio']);
    //Database abm
    Database.Control.cargarTabla(tabla1); //en la fx armarGrilla indicar los elementos q no se muestran
    function promesa(tabla) {
        return new Promise(function (resolve, reject) {
            Dom.spinner('mostrar');
            setTimeout(function () {
                console.log('3 segundos');
                var rdo = Database.Control.save(tabla);
                if (rdo)
                    resolve();
                else
                    reject();
            }, 3000);
        });
    }
    document.getElementById("btnGuardar").addEventListener("click", function () {
        Database.Control.save(tabla1);
    });
    document.getElementById("btnModificar").addEventListener("click", function () {
        Database.Control.modificar(tabla1);
    });
    document.getElementById("btnEliminar").addEventListener("click", function () {
        Database.Control.eliminar(tabla1);
    });
    //set eventos
    Dom.setBotonCerrar();
    Dom.setButtonShowHide("btnShow", form1.idFormCntr);
    document.getElementById("inputTipo").addEventListener("change", function () {
        form1.loadEmpty();
    });
    document.getElementById("btnShow").addEventListener("click", function () {
        form1.loadEmpty();
    });
    document.getElementById("checkId").addEventListener("change", function () {
        tabla1.armarTabla();
    });
    document.getElementById("checkMarca").addEventListener("change", function () {
        tabla1.armarTabla();
    });
    document.getElementById("checkModelo").addEventListener("change", function () {
        tabla1.armarTabla();
    });
    document.getElementById("checkPrecio").addEventListener("change", function () {
        tabla1.armarTabla();
    });
    document.getElementById("checkAuto").addEventListener("change", function () {
        tabla1.armarTabla();
    });
    document.getElementById("checkCamioneta").addEventListener("change", function () {
        tabla1.armarTabla();
    });
};
// tsc –w --outFile index.js ./*/*.ts
