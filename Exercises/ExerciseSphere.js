// All exercises must inherit from GenericExercise
ExerciseSphere.prototype = new GenericExercise();
ExerciseSphere.prototype.constructor = ExerciseSphere;

// Constructor
function ExerciseSphere( name, number, callback, gl, shaderName ) 
{    
    GenericExercise.call(this, name, number, callback); // mandatory ...
    
    // ui ... 
    this.diff = 0;

    // Add a full scene ...
    this.cameraAt = new Vector(2,0,0.5);
    this.cameraTo = new Vector(0,0,0);
    this.scene = new Scene();
    this.scene.AddCamera( 
	new Camera( this.cameraAt, //eyePos ,
		    this.cameraTo, //centerPos , 
		    new Vector(0,0,1), //up , 
		    // width , height , fov , near , far
		    512, 512, 25.0, 0.01, 1000.0
		  ) 
    );

    this.shader = new MultipleShader( gl );
    this.scene.AddShader( this.shader );

    // Add an object box ...
    var obj = new Sphere( "Sphere", this.shader, 32, 64, [1,1,1,1] );
    this.scene.AddObject( obj ) ;
    obj.SetAnimate( function(t,o) {
	o.SetMatrix( new Matrix().Scale(0.5).RotateZ( t*2*Math.PI*0.0025 ) )
    } );
        
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

ExerciseSphere.prototype.onkeypress = function( event ) {
    if ( event.key == 'Up'    ) {
	exercises[exo].addTranslateZ( 1.0/25.0 );
    } else if( event.key == 'Down'  ) {
	exercises[exo].addTranslateZ( -1.0/25.0 );
    } else if( event.key == 'Left'  ) {
	exercises[exo].addTranslateY( -1.0/25.0 );
    } else if( event.key == 'Right' ) {
	exercises[exo].addTranslateY( 1.0/25.0 );
    }
    else 
	return false;
    return true;
};
ExerciseSphere.prototype.addTranslateY = function( val ) {
    this.cameraAt.m[1] += val;
    this.cameraTo.m[1] += val;
    this.scene.GetActiveCamera().ComputeMatrices(); 
    // call the postRedisplay() function (in webgl.js)
    if( !animate ) update(); 
};
ExerciseSphere.prototype.addTranslateZ = function( val ) {
    this.cameraAt.m[2] += val;
    this.cameraTo.m[2] += val;
    this.scene.GetActiveCamera().ComputeMatrices(); 
    // call the postRedisplay() function (in webgl.js)
    if( !animate ) update(); 
};

ExerciseSphere.prototype.Display = function(einfo)
{   // modify displayed information 
    einfo.innerHTML  = this.diff + " ms";
};

ExerciseSphere.prototype.Show = function() {
    this.divHTML.style.display = 'block';
    if( this.button != null )
	this.button.setAttribute( 'class', "button-selected" );
};

ExerciseSphere.prototype.Hide = function() {
    this.divHTML.style.display = 'none';
};

ExerciseSphere.prototype.setDimension = function(width, height) {
    this.scene.setWidth( width );
    this.scene.setHeight( height );
};

ExerciseSphere.prototype.Animate = function() {
    this.scene.Animate();
};

// called once, to initialize the GL data
ExerciseSphere.prototype.Prepare = function( gl ) 
{
    this.scene.Prepare( gl );
};


ExerciseSphere.prototype.Draw = function( gl ) 
{
    // chrono ON
    var start = new Date().getMilliseconds();

    // here the drawings ...
    gl.enable( gl.DEPTH_TEST );
    this.scene.Draw(gl);

    // chrono OFF
    this.diff = (new Date()).getMilliseconds() - start;
};



