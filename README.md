# affectiva_sound

Ejemplos de reproduccion de sonido y click en función de la expresión facial detectada para la asignatura IPO 2019

**Se puede probar en: https://samuel-m-p.github.io/affectiva_sound/index.html** (Puede tardar en cargar)

## 1. Cómo usarlo

- Apretar el botón start
- Permitir al navegador usar la cámara.
- Esperar a que debajo de 'DETECTOR LOG MSGS' aparezca lo siguiente:
```
Clicked the start button
Webcam access allowed
The detector reports initialized
```
- Para que funcione bien, se debe poner la cara de frente a la cámara (sin girar el cuello) y en posición vertical. Una vez que reconozca el rostro, aparecerán una serie de valores bajo EMOTION TRACKING RESULTS.
- Probar a poner diferentes expresiones con la cara (alegría, enfado, sorpresa,etc.) y mantenerlas. Cuando el valor detectado para esa expresión en 'DETECTOR LOG MSGS' supere *50*, comenzará a sonar un archivo de audio.

*Nota 1: el tracking en general funciona mejor con buenas condiciones de iluminación, la cara centrada, sin gafas y sin barba*
*Nota 2: puede tardar en cargar e iniciar el tracking en función de la conexión, potencia del pc, etc.*

### 1.1. Prerequisitos

Una webcam :)

Probado en Firefox 65.0.2 (64-bits) y Chrome 72.0.3626.121 (Build oficial) (64-bits)

### 1.2. Descarga y ejecucion local

- Descargar el proyecto. La forma más sencilla es descargarlo via web (Clone or Download => Download zip)

- Descomprimir y abrir el archivo 'index.html' en el navegador.

## 2. Explicación del código

El codigo contiene dos ejemplos:

- Reproducción de audio en funcion de la expresion emocional detectada
- Click en un botón al detectar levantamiento de cejas

### 2.1 Reproducción de audio en funcion de la expresion emocional

Si no se toca nada, es el ejemplo activo.

Está al comienzo del archivo (*/js/testaffectiva.js*).

Lo primero que se hace es guardar los archivos de audio en variables:
```
var audio_joy = new Audio('http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02.wav');
...
...
```

Luego, la función *checkEmotions(faces)* se llama en cada ciclo de procesamiento. Lo que hace es comprobar si una expresion pasa del 50% del valor y hace sonar un archivo de audio en funcion de la emocion detectada (si no hay otro sonido siendo reproducido).

En esta función podéis ver cómo acceder a los valores devueltos por affectiva.

#### Ejemplo para alegría:

- Si el valor de alegria es mayor de 50 y no se esta reproduciendo otro audio, se reproduce el audio asociado a alegria
```
function checkEmotions(faces){
	if(faces[0].emotions.joy > 50 && isPlaying(audio_joy) == false && isPlaying(audio_sad) == false && 
	isPlaying(audio_anger) == false && isPlaying(audio_surprise) == false) {
		audio_joy.play();
	}
```
- Si el valor de alegria es menor de 50 o se esta reproduciendo otro audio, se reproduce el audio asociado a alegria
```
else if (faces[0].emotions.joy < 50 && isPlaying(audio_joy) == true) {
		audio_joy.pause();
		audio_joy.currentTime = 0;
	}
```

Y esta misma estructura se sigue para el resto de emociones.

### 2.2 Click en un botón al detectar levantamiento de cejas

Este ejemplo no esta activo. Para activarlo:
- editar el archivo (*/js/testaffectiva.js*) 
- renombrar la funcion anterior (checkEmotions) con otro nombre
- renombrar la funcion *checkEmotions_1* a *checkEmotions*


La funcion *checkEmotions_1* en cada ciclo de procesamiento comprueba si el valor de levantamiento cejas es mayor de 50. En caso de serlo, se hace click en el boton y se lanza un temporizador que impide hacer un nuevo click durante un segundo (para evitar muchos clicks consecutivos).

 /**
 * Hace click en el boton al levantar las cejas mas de 50%
 * Activa un temporizador de un seg para impedir clicks consecutivos
 */
 
```
var time_click = 1; //Indica el tiempo (en seg) necesario para poder activar el siguiente click
var can_click = true;
function checkEmotions_1(faces){
	if(faces[0].expressions.browRaise > 50){ //Si se levantan las cejas a mas del 50%
		var el = document.getElementById("regular_button");
		if(can_click){ //Si ha pasado un segundo despues del anterior click
			el.click(); //lanzamos el click
			window.setTimeout(function checkClick(){can_click = true;}, 1000 * time_click); //lanzamos temporizador para habilitar el siguiente click
			can_click = false; //indicamos que no se puede hacer click
		}
	}
}
```

La funcion *regular_button_click* es la funcion que se llama al hacer click en el elemento *regular_button* del *index.html*. 
Para que salte el evento, se añade el nombre de la función javascript que se llamará al hacer click. Se pone en el atributo "onclick" del elemento html:

```
<button type="button" id="regular_button" class="clickable" onclick='regular_button_click();'>Nº VECES CLICK: </button>
```

Luego, esa funcion en javascript lo único que hace es modificar el contenido del elemento html llevando la cuenta del numero de clicks que se han activado sobre dicho elemento:

```
 /**
 * Callback cuando se hace click en el botton regular_button. Cambia el contenido
 * del elemento html para llevar la cuenta del numero de clicks
 */
var contador_clicks = 0;
function regular_button_click(){
	contador_clicks++;
	document.getElementById("regular_button").innerHTML = "Nº VECES CLICK: " + contador_clicks.toString();
}
```

## Enlaces

* [Affectiva](https://developer.affectiva.com/) - Requiere registro. Una vez registrado se tiene acceso a otras SDKs (C#, CPP, Android)
* [Affectiva sample](https://jsfiddle.net/affectiva/opyh5e8d/show/) - Ejemplo original
