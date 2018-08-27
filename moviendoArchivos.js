 // JavaScript Document
  
"use strict";
var zonadatos,boton,espacio_asignado,ruta,botonMover,botonBorrar,botonEscribir;

function inicio(){
	zonadatos=document.getElementById("zonadatos");
	boton=document.getElementById("boton");
	boton.addEventListener("click",crear,false);
	
	botonMover=document.getElementById("mover");
	botonMover.addEventListener("click",modificar,false);
	
	botonBorrar=document.getElementById("borrado");
	botonBorrar.addEventListener("click",borrarArchivo,false);
	
	botonEscribir=document.getElementById("introducirTexto");
	botonEscribir.addEventListener("click",escribir_archivo, false);
	
	
	/*PRIMER PARAMETRO ES EL ESPACIO QUE VA A OCUPAR EL SISTEMA DE ARCHIVOS, MEDIDO EN BITES, LO QUEREMOS EN MEGAS, POR ESO PONEMOS 1024 AL CUADRADO.
	ESTA INSTRUCCION PIDE PERMISO AL NAVEGADOR PARA PODER CREAR UN ESPACIO EN DISCO */
	
	navigator.webkitPersistentStorage.requestQuota(5*1024*1024, acceso);
}

function acceso(){
	
	/*PARAMETROS DEL METODO "RequestFileSystem":
		1º El tipo de espacio donde vamos a crear el sistema de archivo= PERSISTENT O TEMPORARY;
		2º De nuevo el espacio que queremos reservar para el sistema de archivos;
		3º La llamada a una funcion en caso de que tengamos exito en la creacion del sistema de archivos;
		4º La llamada a una funcion en caso de que NO tengamos exito en la creacion del sistema de archivos;*/
	
	window.webkitRequestFileSystem(window.PERSISTENT, 5*1024*1024, crearsis, errores);
	/*Al crear un sistema de archivos con "RequestFileSysten" se lanza un objeto "fileSystem",que se crea cuando "ABRIMOS o CREAMOS" un sistema de archivos, el cual tiene que ser capturado por la funcion que usamos dentro de este metodo.
	Esta lo captura a modo de parametro;*/
}

/*ESTA FUNCION RECIBE COMO PARAMETRO EL OBJETO "fileSystem" QUE LANZA AL FORMAR PARTE DE "RequestFileSystem", al que vamos a llamar "sistema".*/

function crearsis(sistema){
	/*sistema hace referencia al objeto "fileSystem", que se crea cuando abrimos o creamos un sistema de archivos con "RequestFileSystem".*/
	espacio_asignado=sistema.root;
	ruta="";
	mostrarSiExito();
}
function crear(){
	var archivo=document.getElementById("entrada").value;
	var directorios=document.getElementById("carpeta").value;
	
	if(archivo!==""){
		archivo=ruta + archivo;
		
		/*Si usamos "getFile" obtenemos un directorio*/		
		espacio_asignado.getFile(archivo,{create:true, exclusive:false},mostrarSiExito,errores);		

	}
	 if(directorios!==""){
		directorios=ruta + directorios;
		
		/*Si usamos "getDirectory" obtenemos un directorio*/
		espacio_asignado.getDirectory(directorios,{create:true, exclusive:false},mostrarSiExito,errores);
	}
		
}
function mostrarSiExito(){
	document.getElementById("entrada").value="";
	document.getElementById("carpeta").value="";
	zonadatos.innerHTML="";
	espacio_asignado.getDirectory(ruta, null, leerDirectorio,errores);
	
	/*EL METODO "getDirectory", cuando el segundo parametro es "null", quiere decir que no va a crear un directorio nuevo, 
	sino que va a mostrar el directorio en el que nos encontramos y lanza un objeto a la funcion "leerDirectorio" en forma de 
	parametro.
	Dicho objeto es el directorio donde nos encontramos*/
}
function leerDirectorio(directorio){
	
	/*El metodo "createReader()" accede a la lista de archivos y directorios en una ruta especificada y devuelve un objeto
	 "DirectoryReader", el cual contiene el metodo "readEntries", usado para leer archivos y directorios, este recibe dos
	 parametros: Dos llamadas a funciones--(exito,error).
	 En este caso lo que hemos hecho es abreviar codigo, en vez de crear mas funciones, hemos usado la nomenclatura del punto
	 para concatenar metodos y donde iria una llamada a funcion dentro de "readEntries", le hemos puesto una funcion anonima, 
	 lo cual simplifica bastante el codigo*/
	
	directorio.createReader().readEntries(function(files){
		if(files.length){
			listar(files);
		}
	},errores);
}
function listar(files){
	for(var i=0;i<files.length;i++){
		if(files[i].isFile){
			zonadatos.innerHTML+=files[i].name + "<br>";
		}
		else if(files[i].isDirectory){
			zonadatos.innerHTML+="<span onclick='cambiarDireccion(\"" + files[i].name + "\")'  class='directorio'>" + files[i].name + "</span><br>";
		}
	}
}
function cambiarDireccion(nuevaRuta){
	ruta=ruta + nuevaRuta +"/";
	mostrarSiExito();
}
function volver(){
	/*El metodo "getDirectory" tiene 4 parametros*/
	/*El metodo "getParent" tiene 2 parametros*/
	espacio_asignado.getDirectory(ruta, null, function(directorioActual){
		directorioActual.getParent(function(directorioPadre){
			ruta=directorioPadre.fullPath;
			mostrarSiExito();
		},errores);
	},errores);
}
function modificar(){
	var origen=document.getElementById("archivo_origen").value;
	var destino=document.getElementById("directorio_destino").value;
	
	espacio_asignado.getFile(origen, null, function(archivo){
		espacio_asignado.getDirectory(destino, null, function(directorio){
			archivo.moveTo(directorio, null, function(){
				document.getElementById("archivo_origen").value="";
				document.getElementById("directorio_destino").value="";
					mostrarSiExito();
			},errores);
		},errores);
	},errores);
}
function borrarArchivo(){
	
	/*El metodo "remove" tiene 2 parametros:
		-¡¡(exito,error)!!*/
	/*El metodo "removeRecursively" tiene los 
	mismos parametros:
		-¡¡(exito,error)!!*/
	
	var borrarFile=document.getElementById("borrarArchivo").value;	
	var borrarDirectory=document.getElementById("borrarDirectorio").value;
	
		borrarFile=ruta + borrarFile;
		borrarDirectory=ruta + borrarDirectory;
	
	if(borrarFile){
		
			espacio_asignado.getFile(borrarFile, null, function(archivo){
				archivo.remove(function(){
					document.getElementById("borrarArchivo").value="";
					mostrarSiExito();
				},errores);
			},errores);	
	}
	else if(borrarDirectory){

			espacio_asignado.getDirectory(borrarDirectory, null, function(directorio){
				directorio.removeRecursively(function(){
					document.getElementById("borrarDirectorio").value="";
					mostrarSiExito();
				},errores);
			},errores);
	}
}
function escribir_archivo(){
	var nombre=document.getElementById("entrada").value;
	
		espacio_asignado.getFile(nombre, {create:true,exclusive:false}, function(parametro){
			parametro.createWriter(function(fileWriter){
				var text=document.getElementById("texto").value;
					fileWriter.onwriteend=siExito();
				var objeto_blob=new Blob([text], {type:"text/html"});
					fileWriter.write(objeto_blob);
			},errores);
		},errores);
	/*El metodo "createWriter" tiene 2 parametros:
		-(exito,errror);*/
	/*El constructor "new Blob" tiene 2 parametros:
		-(El array  que escribimos en el "textArea" y
		el tipo de informacion que le estamos pasando )*/
}
function siExito(){
	document.getElementById("entrada").value="";	
	document.getElementById("texto").value="";	
		zonadatos.innerHTML="Datos introducidos con éxito!!";
}

function errores(evento){
	/*Cuando se produce un error se lanza tambien un objeto que hay que capturar al que por convencion llamamos "e" o "evento";*/
	alert("Lo sentimos, la acción no se ha realizado correctamente. 'Código de error:'" + evento.code);
	document.getElementById("borrarDirectorio").value="";
	document.getElementById("borrarArchivo").value="";
	document.getElementById("archivo_origen").value="";
	document.getElementById("directorio_destino").value="";
	document.getElementById("entrada").value="";
	document.getElementById("carpeta").value="";
}


window.addEventListener("load",inicio,false);
