// All objects must inherit from Generic Object
BezierCurve.prototype = Object.create( GenericObject.prototype );
BezierCurve.prototype.constructor = BezierCurve ;

/**
* Creates a new BezierCurve instance.
* @param name name of the instance
* @param shader shader for the GL rendering
* @param nbSamples number of line segments for the rendering
* @param points control points of the bezier curve
* @param colors for each control point (optionnal)
*/
function BezierCurve( name , shader , nbSamples, points , colors )
{
    // Call parent constructor (mandatory !)
    GenericObject.call( this , name , shader ) ;

    // The shader cannot use any surface attribute ...
    if( shader.GetAttribute( AttributeEnum.normal )
      || shader.GetAttribute( AttributeEnum.tangent )
      || shader.GetAttribute( AttributeEnum.bitangent )
      || shader.GetAttribute( AttributeEnum.texcoord ) )
    {
		    console.log( "BezierCuve created with bad shader ..." );
    }

    if ( !(points instanceof Array) )
      throw new Error("BezierCurve shall be called with a point array!");

    this.nbSamples = nbSamples;

    this.n = points.length / 3;
    if ( this.n < 2 )
		  throw new Error("BezierCurve shall be called with at least two points!");

    // Creates the data for GPU ...
    var vecs = [];
    if( shader.GetAttribute( AttributeEnum.color ) ) {
    	// We need colors for the rendering ...
    	if ( (colors == undefined) || !(colors instanceof Array ) ) {
    	    // Oups, we do not have colors! Create them ...
    	    colors = [];
    	    for(var n=0; n<this.n; ++n) {
      			colors[4*n+0] = 1; // white
      			colors[4*n+1] = 1; // is
      			colors[4*n+2] = 1; // white
      			colors[4*n+3] = 1; // ;-)
    	    }
    	}
    	for(var n=0; n<this.n; ++n) {
    	    vecs[n] = new PointData( points[3*n+0], points[3*n+1], points[3*n+2],
    				     colors[4*n+0], colors[4*n+1], colors[4*n+2], colors[4*n+3] );
    	}
    } else {
  		for(var n=0; n<this.n; ++n) {
  			vecs[n] = new PointData( points[3*n+0], points[3*n+1], points[3*n+2] );
  		}
    }
    this.points = vecs ;
} ;


/**
* de Casteljau's algorithm
* @param t the parametric position
* @returns the point at position t
*/
BezierCurve.prototype.Q = function( t ) {
    // we use a temporary array
    var vecs = [];

    // TODO:
    //   1- copy the control points to vecs (the copies are modified ...)
    for(var i = 0; i< this.n ; i++){
      vecs.push( new PointData( this.points[i] ) );
    }

    //   2- de Casteljau (n-1)-order interpolation on this copied array ...
    for(var j=1 ; j<this.points.length ; j++){
      for(var i=0 ; i<this.points.length-j ; i++){
        vecs[i] = vecs[i].Lerp(t, vecs[i+1]);
      }
    }



    /*for(var i = this.n ; i> 1 ; i--){
      for(var j = 1 ; j < i ; j++){
        vecs[j] = vecs[j].Lerp(t, vecs[j+1]);
      }
    }*/
    // END TODO

    // the result should be vecs[0] ...
    return vecs[0];
};


/**
* Overload Prepare
* @param gl WebGL context
*/
BezierCurve.prototype.Prepare = function( gl )
{
  // X Y Z R G B A
  var data = [];
  var t = 0.0;
  var pos = 0;
  var nb = 0;
  while( t <= 1.0 ) {
      ++nb; // one more vertex ...
      var vec = this.Q( t );
      for(var i=0; i<7; ++i) data[pos++] = vec.m[i];
      t+=1.0/(this.nbSamples-1);
  }
  // Create buffer
  this.vbo = gl.createBuffer( ) ;

  gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo ) ;
  gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( data ) , gl.STATIC_DRAW ) ;

  this.vbo.itemSize = 3 ;
  this.vbo.numItems = nb ;
} ;

/**
* Overload draw
* @param gl WebGL context
* @param scn rendered scene
*/
BezierCurve.prototype.Draw = function( gl , scn )
{
    // Fill all parameters for rendering
    this.shader.setAttributes( this.vbo );

    // Let's render !
    gl.lineWidth( 4.0 );
    gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo ) ;
    gl.drawArrays( gl.LINE_STRIP , 0 , this.vbo.numItems ) ;
    gl.lineWidth( 1.0 );
}
