/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
/// Primer ejemplo: audio en funcion de la expresion emocional
/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
 
 /**
	* Hace sonar un archivo de audio en funcion de la emocion detectada.
	* faces[0] es la primera cara encontrada. Contiene valores de apariencia, emociones y gestos
	* se puede acceder a ellos mediante: 
	* 	faces[0].emotions.joy					(otros: sadness, disgust, contempt, anger, fear, surprise)
	*		faces[0].appearance.gender		(otros: glasses, age, ethnicity)
	*		faces[0].expressions.smile		(otros: innerBrowRaise, browRaise, browFurrow, noseWrinkle, upperLipRaise,
																						lipCornerDepressor, chinRaise, lipPucker, lipPress, lipSuck, mouthOpen,
																						smirk, eyeClosure, attention, lidTighten, jawDrop, dimpler, eyeWiden,
																						cheekRaise, lipStretch)
 */
  	// Archivos de audio
  var audio_joy = new Audio('http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02.wav');
  var audio_sad = new Audio('http://www.moviewavs.com/0053148414/WAVS/Movies/Willy_Wonka_And_The_Chocolate_Factory/cheerupcharlie.wav');
  var audio_anger = new Audio('http://www.moviewavs.com/0053148414/WAVS/Movies/Star_Wars/imperial.wav');
  var audio_surprise = new Audio('http://www.moviewavs.com/0053148414/WAVS/TV_Shows/X-Files/xfiles.wav');
	
  function checkEmotions(faces){
	  		
		if(faces[0].emotions.joy > 50 && isPlaying(audio_joy) == false && isPlaying(audio_sad) == false && 
				isPlaying(audio_anger) == false && isPlaying(audio_surprise) == false) {
			//Si el valor de alegria es mayor de 50 y no se esta reproduciendo otro audio, 
			//se reproduce el audio asociado a alegria
			audio_joy.play();
		}
		else if (faces[0].emotions.joy < 50 && isPlaying(audio_joy) == true) {
			//Si el valor de alegria es menor de 50 o se esta reproduciendo otro audio, 
			//se reproduce el audio asociado a alegria
			audio_joy.pause();
			audio_joy.currentTime = 0;
		}
		
		if(faces[0].emotions.sadness > 50 && isPlaying(audio_joy) == false && isPlaying(audio_sad) == false && 
				isPlaying(audio_anger) == false && isPlaying(audio_surprise) == false) {
			audio_sad.play();
		}
		else if (faces[0].emotions.sadness < 50 && isPlaying(audio_sad) == true) {
			audio_sad.pause();
			audio_sad.currentTime = 0;
		}
		if((faces[0].emotions.anger > 50 || faces[0].emotions.disgust > 50) && isPlaying(audio_joy) == false && 
				isPlaying(audio_sad) == false && isPlaying(audio_anger) == false && isPlaying(audio_surprise) == false) {
			audio_anger.play();
		}
		else if (faces[0].emotions.anger < 50 && faces[0].emotions.disgust < 50 && isPlaying(audio_anger) == true) {
			audio_anger.pause();
			audio_anger.currentTime = 0;
		}
		if(faces[0].emotions.surprise > 50 && isPlaying(audio_joy) == false && isPlaying(audio_sad) == false && 
				isPlaying(audio_anger) == false && isPlaying(audio_surprise) == false) {
			audio_surprise.play();
		}
		else if (faces[0].emotions.surprise < 50 && isPlaying(audio_surprise) == true) {
			audio_surprise.pause();
			audio_surprise.currentTime = 0;
		}
  }
	
	/**
	* Comprueba si el sonido currentAudio está activo.
	* 
	*/
  function isPlaying (currentAudio) {
    return currentAudio
        && currentAudio.currentTime > 0
        && !currentAudio.paused
        && !currentAudio.ended
        && currentAudio.readyState > 2;
   }


/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
/// Segundo ejemplo: click en boton al levantar las cejas
/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 

 /**
	* Hace click en el boton al levantar las cejas mas de 50%
	* Activa un temporizador de un seg para impedir clicks consecutivos
 */

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

 /**
	* Callback cuando se hace click en el botton regular_button. Cambia el contenido
	* del elemento html para llevar la cuenta del numero de clicks
 */
var contador_clicks = 0;
function regular_button_click(){
	contador_clicks++;
	document.getElementById("regular_button").innerHTML = "Nº VECES CLICK: " + contador_clicks.toString();
}





/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
/// Funciones de affectiva
/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
var detector = null;
$(document).ready(function(){
  // SDK Needs to create video and canvas nodes in the DOM in order to function
  // Here we are adding those nodes a predefined div.
  var divRoot = $("#affdex_elements")[0];
  var width = 640;
  var height = 480;
  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
   
  //Construct a CameraDetector and specify the image width / height and face detector mode.
  detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

  //Enable detection of all Expressions, Emotions and Emojis classifiers.
  detector.detectAllEmotions();
  detector.detectAllExpressions();
  detector.detectAllEmojis();
  detector.detectAllAppearance();

  //Add a callback to notify when the detector is initialized and ready for runing.
  detector.addEventListener("onInitializeSuccess", function() {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
  });

  //Add a callback to notify when camera access is allowed
  detector.addEventListener("onWebcamConnectSuccess", function() {
    log('#logs', "Webcam access allowed");
  });

  //Add a callback to notify when camera access is denied
  detector.addEventListener("onWebcamConnectFailure", function() {
    log('#logs', "webcam denied");
    console.log("Webcam access denied");
  });

  //Add a callback to notify when detector is stopped
  detector.addEventListener("onStopSuccess", function() {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
  });

  //Add a callback to receive the results from processing an image.
  //The faces object contains the list of the faces detected in an image.
  //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
  detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
    if(faces.length > 0)
    {
    $('#results').html("");

	    log('#results', "Number of faces found: " + faces.length);
	    if (faces.length > 0) {
	      log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
	      log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
	        return val.toFixed ? Number(val.toFixed(0)) : val;
	      }));
	      log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
	        return val.toFixed ? Number(val.toFixed(0)) : val;
	      }));
	      log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
	      //drawFeaturePoints(image, faces[0].featurePoints);
		  
			
		  //Comprobar emociones detectadas y poner sonido
		  checkEmotions(faces);
			
	    }

		
	}
     else
	{
	  //log('#logs', "No faces detected");
	}
  });

  //Draw the detected facial feature points on the image
  function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
      contxt.beginPath();
      contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
      contxt.stroke();

    }
  }
});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
  }
  log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();

    $('#results').html("");
  }
};

$(window).bind('beforeunload', function(){
if(detector != null){
        detector.stop();
}
});