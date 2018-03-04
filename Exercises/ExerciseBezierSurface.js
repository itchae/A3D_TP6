// All exercises must inherit from GenericExercise
ExerciseBezierSurface.prototype = Object.create( GenericExercise.prototype );
ExerciseBezierSurface.prototype.constructor = ExerciseBezierSurface;

// Constructor
function ExerciseBezierSurface( name, number, callback, gl, shaderName )
{
    GenericExercise.call(this, name, number, callback); // mandatory ...

    // ui ...
    this.diff = 0;

    // Add a full scene ...
    this.cameraAt = new Vector(8,8,5);
    this.cameraTo = new Vector(0,0,2);
    this.scene = new Scene();
    this.scene.AddCamera(
	new Camera( this.cameraAt, //eyePos ,
		    this.cameraTo, //centerPos ,
		    new Vector(0,0,1), //up ,
		    // width , height , fov , near , far
		    512, 512, 60.0, 0.01, 1000.0
		  )
    );

    this.shader = new MultipleShader( gl );
    this.scene.AddShader( this.shader );


    // Objects are defined here ..
    var line_shader = new DefaultShader( gl ) ;
    this.scene.AddShader( line_shader );
    var axis = new Axis( "Axis1" , line_shader , new Vector( 0 , 0 , 0 ) ,
			 100.0 ) ;
    this.scene.AddObject( axis ) ;

    // Exercise 4:
    var gumbo = new Gumbo( "gumbo1", this.shader, 16, [ 1, 1, 0.2, 1.0 ] );
    gumbo.SetAnimate( function(tick, obj) {
	obj.SetMatrix( new Matrix()
		       .Scale(0.4)
		       .Translate(new Vector(-4,-2,0))
		       .RotateZ(tick*Math.PI/100)
		       .Translate(new Vector( 4, -5, -3 ))
		       // .RotateX(Math.PI/2)
		       // .RotateZ(tick*Math.PI/100)
		     );
    });
    this.scene.AddObject( gumbo );

    // teapot
    var teapot = new Teapot( "teapot1", this.shader, 16, [ 1, 0.2, 1, 1.0 ] );
    teapot.SetAnimate( function(tick, obj) {
	     obj.SetMatrix( new Matrix()
		       .Scale(0.04)
		       .RotateZ(tick*Math.PI/100)
		       .RotateY(tick*Math.PI/250)
		       .RotateZ(tick*Math.PI/1000)
		       .Translate(new Vector(-5,5,0))
		     );
    });
    this.scene.AddObject( teapot );


    // add parameters to UI
    this.divHTML = document.createElement("div");
    this.divHTML.id = "exo-param-"+number;
    this.divHTML.style.display = 'none';

    var menu = document.getElementById("menu");
    menu.insertBefore(this.divHTML, document.getElementById("param-bottom"));

    // the parameters are button ...
    var exercise = this;
    this.button = this.createButton("mode0", "Color", function(button){
	exercise.shader.SetMode(0); if(!animate)update();
	if( exercise.button != null )
	    exercise.button.setAttribute('class' , "button" );
	exercise.button = button;
	button.setAttribute('class' , "button-selected" );
    });
    this.divHTML.appendChild( this.button );
    this.button.setAttribute('class', "button-selected");
    this.divHTML.appendChild(
	this.createButton("mode1", "Normal", function(button){
	    exercise.shader.SetMode(1); if(!animate)update();
	if( exercise.button != null )
	    exercise.button.setAttribute('class' , "button" );
	exercise.button = button;
	button.setAttribute('class' , "button-selected" );
	})
    );
    this.divHTML.appendChild(
	this.createButton("mode2", "Tangent", function(button){
	    exercise.shader.SetMode(2); if(!animate)update();
	if( exercise.button != null )
	    exercise.button.setAttribute('class' , "button" );
	exercise.button = button;
	button.setAttribute('class' , "button-selected" );
	})
    );
    this.divHTML.appendChild(
	this.createButton("mode3", "Bitangent", function(button){
	    exercise.shader.SetMode(3); if(!animate)update();
	if( exercise.button != null )
	    exercise.button.setAttribute('class' , "button" );
	exercise.button = button;
	button.setAttribute('class' , "button-selected" );
	})
    );
    this.divHTML.appendChild(
	this.createButton("mode4", "Texture", function(button){
	    exercise.shader.SetMode(4); if(!animate)update();
	if( exercise.button != null )
	    exercise.button.setAttribute('class' , "button" );
	exercise.button = button;
	button.setAttribute('class' , "button-selected" );
	})
    );

};

ExerciseBezierSurface.prototype.onkeypress = function( event ) {
    if ( event.key == 'Up' ||  event.key == 'ArrowUp' || event.key == 'z' || event.key == 'Z' ) {
	exercises[exo].addTranslateXYZ( 2, 1.0/25.0 );
    } else if( event.key == 'Down' ||  event.key == 'ArrowDown' || event.key == 'd' || event.key == 'D' ) {
	exercises[exo].addTranslateXYZ( 2, -1.0/25.0 );
    } else if( event.key == 'Left' ||  event.key == 'ArrowLeft' || event.key == 'q' || event.key == 'Q' ) {
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

ExerciseBezierSurface.prototype.addTranslateXYZ = function( xyz, val ) {
    this.cameraAt.m[xyz] += val;
    this.cameraTo.m[xyz] += val;
    this.scene.GetActiveCamera().ComputeMatrices();
    // call the postRedisplay() function (in webgl.js)
    if( !animate ) update();
};

ExerciseBezierSurface.prototype.Display = function(einfo)
{   // modify displayed information
    einfo.innerHTML  = this.diff + " ms";
};

ExerciseBezierSurface.prototype.Show = function() {
    this.divHTML.style.display = 'block';
    if( this.button != null )
	this.button.setAttribute( 'class', "button-selected" );
};

ExerciseBezierSurface.prototype.Hide = function() {
    this.divHTML.style.display = 'none';
};

ExerciseBezierSurface.prototype.setDimension = function(width, height) {
    this.scene.setWidth( width );
    this.scene.setHeight( height );
};

ExerciseBezierSurface.prototype.Animate = function() {
    this.scene.Animate();
};

// called once, to initialize the GL data
ExerciseBezierSurface.prototype.Prepare = function( gl )
{
    this.scene.Prepare( gl );
};


ExerciseBezierSurface.prototype.Draw = function( gl )
{
    // chrono ON
    var start = new Date().getMilliseconds();

    // here the drawings ...
    gl.enable( gl.DEPTH_TEST );
    this.scene.Draw(gl);

    // chrono OFF
    this.diff = (new Date()).getMilliseconds() - start;
};
