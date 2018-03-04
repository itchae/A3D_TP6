// All objects must inherit from Generic Object
BezierSurface.prototype = Object.create(GenericObject.prototype);
BezierSurface.prototype.constructor = BezierSurface ;
/**
* Create a Bezier surface, given a mesh of 4*4 control points ...
*/
function BezierSurface( name , shader , nbSamples, points , colors )
{
    // Call parent constructor (mandatory !)
    GenericObject.call( this , name , shader ) ;

    this.nbSamples = nbSamples;

    if ( !(points instanceof Array) )
	throw new Error("BezierSurface shall be called with a point array!");

    this.n = points.length / 3;
    if ( this.n != 16 )
	throw new Error("BezierSurface shall be called with 16 control points!");

    // creates the main data
    var vecs = [];
    if( shader.GetAttribute( AttributeEnum.color ) ) {
		if ( (colors == undefined) || !(colors instanceof Array ) ) {
			colors = [];
			for(var n=0; n<this.n; ++n) {
				colors[4*n+0] = 1; // white
				colors[4*n+1] = 1; // is
				colors[4*n+2] = 1; // white
				colors[4*n+3] = 1; // ??
			}
		}
		else if (colors instanceof Array) {
			for(var n=colors.length/4; n<this.n; n++) {
				colors[4*n+0] = colors[0];
				colors[4*n+1] = colors[1];
				colors[4*n+2] = colors[2];
				colors[4*n+3] = colors[3];
			}
		}
		// with colors ...
		for(var n=0; n<this.n; ++n) {
			vecs[n] = new PointData( points[3*n+0], points[3*n+1], points[3*n+2],
						 colors[4*n+0], colors[4*n+1], colors[4*n+2], colors[4*n+3] );
		}
    }
    else {
		// without colors
		for(var n=0; n<this.n; ++n) {
			vecs[n] = new PointData( points[3*n+0], points[3*n+1], points[3*n+2] );
		}
    }
  this.points = vecs ;
} ;


// this function creates the triangles ....
// it uses the function Q and dQ ...
BezierSurface.prototype.MakeTriangles = function( data, pos ) {
  var step = 1.0/(this.nbSamples-1);
  var t1 = 0.0;
  var nb = 0;
  for( it = 1;  it<this.nbSamples; ++it ) {
      var t2 = it*step;
      var so = 0.0;
      // push one point
      ++nb;
      var vec = this.Q( 0.0, t1 );
      for(var i=0; i<vec.n; ++i) data[pos++] = vec.m[i];
      var norm = this.dQ( 0.0, t1 );
      for(var i=0; i<norm.n; ++i) data[pos++] = norm.m[i];
      // push 2 times this.nbSamples points
      for(var is=0; is<this.nbSamples; ++is) {
  		  var s = is*step;
  		  // one more vertex ...
  		  ++nb;
  		  vec = this.Q( s, t1 );
  		  for(var i=0; i<vec.n; ++i) data[pos++] = vec.m[i];
  		  norm = this.dQ( s, t1 );
  		  for(var i=0; i<norm.n; ++i) data[pos++] = norm.m[i];
  		  // one more vertex ...
  		  ++nb;
  		  vec = this.Q( s, t2 );
  		  for(var i=0; i<vec.n; ++i) data[pos++] = vec.m[i];
  		  norm = this.dQ( s, t2 );
  		  for(var i=0; i<norm.n; ++i) data[pos++] = norm.m[i];
  		  so = s;
      }
      t1 = t2;
	  // at least push one last vertex
      ++nb;
      vec = this.Q( so, t2 );
      for(var i=0; i<vec.n; ++i) data[pos++] = vec.m[i];
      norm = this.dQ( so, t2 );
      for(var i=0; i<norm.n; ++i) data[pos++] = norm.m[i];
  }
  return [ nb, data, pos ];
}

/**
* Overload Prepare
*/
BezierSurface.prototype.Prepare = function( gl )
{
  // X Y Z R G B A (nx ny nz)
  var pos       = 0;
  var triangles = this.MakeTriangles( [], pos );
  var data      = triangles[1];
  var nb        = triangles[0];

  // Create buffer
  this.vbo = gl.createBuffer( ) ;

  gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo ) ;
  gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( data ) , gl.STATIC_DRAW ) ;

  this.vbo.itemSize = 3 ;
  this.vbo.numItems = nb-2 ;
} ;

/**
* Overload draw
*/
BezierSurface.prototype.Draw = function( gl , scn )
{
    // Set shader
    this.shader.setAttribute( this.vbo );
    // Let's render !
    gl.disable(gl.CULL_FACE);
    gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo ) ;
    gl.drawArrays( gl.TRIANGLE_STRIP , 0 , this.vbo.numItems ) ;
}


// STUDENT WORK come after

/**
* Calculate the Bernstein polynomial $B_{i,3}(u)$ for i in [0,3]
* @param u the parametric value
* @return B_{i,3}(u)
*/
BezierSurface.prototype.bernstein = function(u) {

  var v = 1-u;

  return [
    1*v*v*v,
    3*v*v*u,
    3*v*u*u,
    1*u*u*u
  ];
}

/**
* Calculate the Bernstein derivative polynomial for i in [0,3]
* @param u the parametric value
* @return B'_{i,3}(u)
*/
BezierSurface.prototype.bernsteinDeriv = function(u) {


}

/**
* Calculate the parametric position ...
* @param u first parametric coordinates
* @param v second parametric coordinates
* @returns Q(u,v)
*/
BezierSurface.prototype.Q = function( u, v ) {
    var vec = new PointData( this.points[0].GetSize() );
	// TODO: computes the coordinates ...

  // var bernstein
  //var bernstein
  var bernsteinU = this.bernstein(u);
  var bernsteinV = this.bernstein(v);
  //   2- de Casteljau (n-1)-order interpolation on this copied array ...
  for(var i=0 ; i<4 ; i++){
    for(var j=0 ; j<4 ; j++){
      vec.AddScale(bernsteinU[i]*bernsteinV[j], this.points[i*4+j]);
    }
  }
  return vec;
} ;

/**
* Calculate the parametric derivative
* @param u first coordinates
* @param v second coordinates
* @returns Q'(u,v)
*/
BezierSurface.prototype.dQ = function( u, v ) {
	// TODO: computes the coordinates ...
    var dpdu = [0, 0, 0];
    var dpdv = [0, 0, 0];
	  var normal = [1,1,1,1];
	// fill the normal, tangent, bitangent, and texture coordinates ...
    var data = [];
    // surface normal
    this.addANormal( data, normal);
    this.addATangent( data, dpdu );
    this.addABitangent( data, dpdv );
    this.addTextureCoordinates( data, u, v );

    // returns the result
    return new PointData( data );
} ;
