// OpenGL Canvas
var canvas ;

// OpenGL Context
var gl ;

// Exercises 
var exercises = new Array();

var ticks = 0;
var animate = false;
var width = 1024, height = 768;
var mouse_x = 512;
var mouse_y = 384;

// objects
var exo = 0;
var einfo = null;

// Init WebGL
function initGL()
{
    einfo = document.getElementById("info");
    canvas = document.getElementById("glCanvas") ;
    
    if( ! canvas )
    {
	console.log( "Unable to find canvas" );
	return ;
    }
    
    gl = WebGLDebugUtils.makeDebugContext(
	canvas.getContext("webgl")
	    || canvas.getContext("experimental-webgl")); 

    addEvent( window, 'resize', onWindowResize );
    canvas.onmousedown = function(event) {
	mouse_x = event.clientX-120;
	mouse_y = canvas.height-event.clientY;
	exercises[exo].setMouse( mouse_x, mouse_y );
	if( !animate ) update();
    };
    gl.viewportWidth  = canvas.width ;
    gl.viewportHeight = canvas.height ;  
    
    gl.clearColor( 0.0 , 0.0 , 0.0 , 1.0 ) ; 
    //gl.disable( gl.DEPTH_TEST ) ;
    
    // Prepare scene
    prepareScene() ; 
    onWindowResize();

    // Start render loop 
    update() ; 
} ;


var changeExercise = function(num) {
    //console.log("Exercice "+(num+1));
    if( num >= exercises.length ) return ;
    document.getElementById("exo"+exo).className ="button";
    exercises[exo].Hide();
    exercises[exo].StopAnimation();
    exercises[num].Show();
    exercises[num].Reload();
    exercises[num].setDimension( canvas.width, canvas.height );
    exo = num;
    if( !animate ) {
	update();
    }
    else {
	exercises[num].StartAnimation();
    }
    document.getElementById("exo"+exo).className ="button-selected";
    window.onkeypress = function(event){
	if ( exercises[exo].onkeypress(event) && !animate ) 
	    update();
    }
};


// Scene creation 
function prepareScene()
{
    // add shaders
    exercises.push( new ExerciseBezierCurve( "Exercice 1", exercises.length, changeExercise, gl ) );
    exercises.push( new ExerciseBezierSurface( "Exercice 2", exercises.length, changeExercise, gl ) );


    // really prepare
    for(var i=0; i<exercises.length; ++i)
	exercises[i].Prepare(gl);

    document.getElementById("exo"+exo).className ="button-selected";
    window.onkeypress = function(event){
	if ( exercises[exo].onkeypress(event) && !animate ) 
	    update();
    }
    exercises[exo].Show();
};


/** Render Loop */
function update()
{
    if ( animate ) {
	requestAnimFrame( update ) ; 
	// animate objects ...
	exercises[exo].Animate();
    }

    exercises[exo].Display(einfo);
    // Call rendering 
    draw() ;
} ;


/** Draw function */
function draw() 
{
    exercises[exo].Draw( gl ) ;
};


function startAnimation() {
    animate = !animate;
    if( animate ) {
	exercises[exo].StartAnimation();
	update();
	document.getElementById("animButton").className = "button-selected";
    }
    else {
	exercises[exo].StopAnimation();
	document.getElementById("animButton").className = "button";
    }
};


// resize window ...
var onWindowResize = function( event ) {    
    canvas.width = window.innerWidth - 120;
    canvas.height = window.innerHeight;
    
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    
    width  = canvas.width ;
    height = canvas.height;
    
    for(var i=0; i<exercises.length; ++i) {
	exercises[i].setDimension( canvas.width, canvas.height );
    }
    if (gl) {
	if(!animate) update();
    }
};


var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

