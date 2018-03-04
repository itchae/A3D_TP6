// Class to manage an Exercise (you must inherit from this class)
function GenericExercise( name, number, callback )
{
    this.UIname = name;
    this.number = number;
    this.renderTarget_list = new Array();
    this.scene = null;

    this.name = "exo"+number;

    if( callback===undefined) return; 

    //console.log("GenericExercise.call( "+name+", "+number+")");

    // push exercise in UI (assuming node "menu" and "h1-bottom" exist).
    var button = this.createButton(this.name, 
				   this.UIname, 
				   function() { callback(number); } );
    document.getElementById("menu").
	insertBefore(button, document.getElementById("h1-bottom"));
};

GenericExercise.prototype.createButton = function(id, value, onclick) {
    var button = document.createElement("input");
    button.type = "submit";
    button.id = id;
    button.value = value;
    button.setAttribute('class', "button");
    button.onclick = function(){ onclick(this); };
    return button;
};

// Get the exercise name
GenericExercise.prototype.GetName = function() {
    return this.name;
};

// Get the exercise number (for UI)
GenericExercise.prototype.GetNumber = function() {
    return this.number;
};

// Reload an exercise (UI) : can (should?) be overloaded
GenericExercise.prototype.Reload = function() 
{
    if(this.scene == null) return;
    this.scene.Reload();
};

// Change dimensions ... can be overloaded
GenericExercise.prototype.setDimension = function( width, height ) 
{
    if(this.scene == null) return ;
    this.scene.setWidth( width );
    this.scene.setHeight( height );
};


// Change the mouse position .. can be overloaded
GenericExercise.prototype.setMouse = function( x, y ) {
    if(this.scene == null) return;
    this.scene.setMouse( x, y );
};

// some displacements ...
GenericExercise.prototype.addTranslateX = function( x ) 
{ if(this.scene!=null) this.scene.addTranslateX( x) ; };
GenericExercise.prototype.addTranslateY = function( x ) 
{ if(this.scene!=null) this.scene.addTranslateY( x) ; };
GenericExercise.prototype.multScale = function( x ) 
{ if(this.scene!=null) this.scene.multScale( x) ; };

// user actions: you should overload it!
GenericExercise.prototype.onkeypress = function( event ) {
};

// Update the displayed information
GenericExercise.prototype.Display = function(einfo) {
};

// Animate the exercise
GenericExercise.prototype.Animate = function()
{
};

// Show this exercise
GenericExercise.prototype.Show = function() {};

// Hide this exercise
GenericExercise.prototype.Hide = function() {};

// Overload this function in order to compute additionnal items before drawing.
// You should at least specify links between renderTargets and the scene ...
GenericExercise.prototype.Prepare = function( gl )
{
} ;


// Overload this method in order to draw something
GenericExercise.prototype.Draw = function( gl )
{
} ;

GenericExercise.prototype.StartAnimation = function() {};
GenericExercise.prototype.StopAnimation = function() {};

// function to prepare a shader program ;..
GenericExercise.prototype.load = function( gl, vertex_source_text, fragment_source_text ) 
{
    // Create vertex shader 
    this.vertex_shad = gl.createShader( gl.VERTEX_SHADER );
    
    // Compile vertex shader 
    gl.shaderSource(this.vertex_shad, vertex_source_text );
    gl.compileShader(this.vertex_shad );
    
    if (!gl.getShaderParameter(this.vertex_shad, gl.COMPILE_STATUS)) 
    {
	console.log( "Vertex shader: " + gl.getShaderInfoLog( this.vertex_shad ) );
    }
    
    // Create fragment shader 
    this.fragment_shad = gl.createShader( gl.FRAGMENT_SHADER ) ; 
    gl.shaderSource(this.fragment_shad , fragment_source_text );
    gl.compileShader(this.fragment_shad );
    
    if (!gl.getShaderParameter(this.fragment_shad, gl.COMPILE_STATUS)) 
    {
	console.log( gl.getShaderInfoLog( this.fragment_shad ) ) ;
    }
    
    // Compile and link program
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertex_shad);
    gl.attachShader(this.program, this.fragment_shad);
    gl.linkProgram(this.program);
    
    if ( ! gl.getProgramParameter(this.program, gl.LINK_STATUS) ) 
    {
	console.log("Could not initialise shaders");
    }
};


