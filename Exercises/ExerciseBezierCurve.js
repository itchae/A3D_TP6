// All exercises must inherit from GenericExercise
ExerciseBezierCurve.prototype = Object.create( GenericExercise.prototype );
ExerciseBezierCurve.prototype.constructor = ExerciseBezierCurve;

// Constructor
function ExerciseBezierCurve( name, number, callback, gl, shaderName ) 
{    
    GenericExercise.call(this, name, number, callback); // mandatory ...
    
    // ui ... 
    this.diff = 0;

    // Add a full scene ...
    this.cameraAt = new Vector(6,6,5);
    this.cameraTo = new Vector(0,0,2.5);
    this.scene = new Scene();
    this.scene.AddCamera( 
	new Camera( this.cameraAt, //eyePos ,
		    this.cameraTo, //centerPos , 
		    new Vector(0,0,1), //up , 
		    // width , height , fov , near , far
		    512, 512, 60.0, 0.01, 1000.0
		  ) 
    );

    this.shader = new DefaultShader( gl ) ;
    this.scene.AddShader( this.shader );

    // Objects are defined here ..
    var axis = new Axis( "Axis1" , this.shader , new Vector( 0 , 0 , 0 ) , 100.0 ) ; 
    this.scene.AddObject( axis ) ; 

    // exercise 1:
    var pts1 = [  -1.0, -1.0, 0.0, 
		  -1.5,  1.0, 0.0,
		  -0.5,  2.0, 0.0,
		   0.0,  1.0, 0.0,
		   0.5, -1.0, 0.0,
		   1.0,  1.0, 0.0,  
		   1.0, -1.0, 0.0
	       ];
    var colors = [ 1, 0, 0, 1, 
		   0, 1, 0, 1,
		   0, 1, 1, 1,
		   0, 0, 1, 1,
		   1, 0, 1, 1,
		   1, 1, 1, 1,
		   1, 1, 0, 1
		 ];

    var bezier1 = new BezierCurve( "bezier1" , this.shader, 100, pts1, colors );
    bezier1.SetAnimate(	function(tick, obj) {
	obj.SetMatrix( new Matrix()
		       .Translate(new Vector(1,1,0))
		       .Scale(3)
		       .RotateX(Math.PI/2)
		       .RotateZ(tick*Math.PI/100)
		     );
    });
    this.scene.AddObject( bezier1 ) ; 

    // add parameters to UI
    this.divHTML = document.createElement("div");
    this.divHTML.id = "exo-param-"+number;
    this.divHTML.style.display = 'none';

    var menu = document.getElementById("menu");
    menu.insertBefore(this.divHTML, document.getElementById("param-bottom"));

    // the parameters are button ... 

};

ExerciseBezierCurve.prototype.onkeypress = function( event ) {
    if ( event.key == 'Up' ||  event.key == 'ArrowUp' || event.key == 'z' || event.key == 'Z' ) {
	exercises[exo].addTranslateXYZ( 2, 1.0/25.0 );
    } else if( event.key == 'Down' || event.key == 'ArrowDown' ||  event.key == 'd' || event.key == 'D' ) {
	exercises[exo].addTranslateXYZ( 2, -1.0/25.0 );
    } else if( event.key == 'Left' || event.key == 'ArrowLeft' ||  event.key == 'q' || event.key == 'Q' ) {
	exercises[exo].addTranslateXYZ( 1, -1.0/25.0 );
    } else if( event.key == 'Right' ||  event.key == 'ArrowRight' || event.key == 'd' || event.key == 'D' ) {
	exercises[exo].addTranslateXYZ( 1, 1.0/25.0 );
    } else if( event.key == 'a' || event.key == 'A'  ) {
	exercises[exo].addTranslateXYZ( 0, -1.0/25.0 );
    } else if( event.key == 'e' || event.key == 'E' ) {
	exercises[exo].addTranslateXYZ( 0, 1.0/25.0 );
    }
    else 
	return false;
    return true;
};
ExerciseBezierCurve.prototype.addTranslateXYZ = function( xyz, val ) {
    this.cameraAt.m[xyz] += val;
    this.cameraTo.m[xyz] += val;
    this.scene.GetActiveCamera().ComputeMatrices(); 
    // call the postRedisplay() function (in webgl.js)
    if( !animate ) update(); 
};

ExerciseBezierCurve.prototype.Display = function(einfo)
{   // modify displayed information 
    einfo.innerHTML  = this.diff + " ms";
};

ExerciseBezierCurve.prototype.Show = function() {
    this.divHTML.style.display = 'block';
    if( this.button != null )
	this.button.setAttribute( 'class', "button-selected" );
};

ExerciseBezierCurve.prototype.Hide = function() {
    this.divHTML.style.display = 'none';
};

ExerciseBezierCurve.prototype.setDimension = function(width, height) {
    this.scene.setWidth( width );
    this.scene.setHeight( height );
};

ExerciseBezierCurve.prototype.Animate = function() {
    this.scene.Animate();
};

// called once, to initialize the GL data
ExerciseBezierCurve.prototype.Prepare = function( gl ) 
{
    this.scene.Prepare( gl );
};


ExerciseBezierCurve.prototype.Draw = function( gl ) 
{
    // chrono ON
    var start = new Date().getMilliseconds();

    // here the drawings ...
    gl.enable( gl.DEPTH_TEST );
    this.scene.Draw(gl);

    // chrono OFF
    this.diff = (new Date()).getMilliseconds() - start;
};



