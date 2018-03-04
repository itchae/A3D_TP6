// All objects must inherit from Generic Object 
Axis.prototype = Object.create( GenericObject.prototype );
Axis.prototype.constructor = Axis ;

/** 
* Create an axis given an origin and a size 
*/
function Axis( name , shader , origin , size )
{
  // Call parent constructor (mandatory !)
  GenericObject.call( this , name , shader ) ;

  if( shader.GetAttribute( AttributeEnum.normal ) 
      || shader.GetAttribute( AttributeEnum.tangent ) 
      || shader.GetAttribute( AttributeEnum.bitangent ) 
      || shader.GetAttribute( AttributeEnum.texcoord ) ) 
    {
	console.log( "Axis created with bad shader <"+shader.GetName()+">" );
    }
  this.origin = origin ;
  this.size = size ; 
} ;

/**
* Overload Prepare
*/
Axis.prototype.Prepare = function( gl )
{
    var vertices = [ 
	[ this.origin.X() - this.size / 2.0 , this.origin.Y() , this.origin.Z() ] ,
	[ this.origin.X() + this.size / 2.0 , this.origin.Y() , this.origin.Z() ] ,
	[ this.origin.X() , this.origin.Y() - this.size / 2.0 , this.origin.Z() ] ,
	[ this.origin.X() , this.origin.Y() + this.size / 2.0 , this.origin.Z() ] ,
	[ this.origin.X() , this.origin.Y() , this.origin.Z() - this.size / 2.0 ] ,
	[ this.origin.X() , this.origin.Y() , this.origin.Z() + this.size / 2.0 ]
    ];
    var colors = [
	[ 1.0 , 0 , 0 , 1.0 ] , 
	[ 1.0 , 0 , 0 , 1.0 ] ,
	[ 0 , 1.0 , 0 , 1.0 ] ,
	[ 0 , 1.0 , 0 , 1.0 ] , 
	[ 0 , 0 , 1.0 , 1.0 ] ,
	[ 0 , 0 , 1.0 , 1.0 ]
    ];

    // Create buffer 
    this.vbo = gl.createBuffer( ) ;
    this.vbo.numItems = 6 ; 
    
    // and fill it!
    var data = [] ;
    var pos = 0;
    for(vert=0; vert<vertices.length; ++vert) {
	this.addAPoint( data, vertices[vert] ); 
	this.addAColor( data, colors[vert] );
    }
    
    gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo ) ; 
    gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( data ) , gl.STATIC_DRAW ) ; 
} ;

/**
* Overload draw
*/
Axis.prototype.Draw = function( gl , scn )
{
    // Let's the shader prepare its attributes
    this.shader.setAttributes( this.vbo );
    // Let's render !
    gl.bindBuffer( gl.ARRAY_BUFFER , this.vbo );
    gl.drawArrays( gl.LINES , 0 , this.vbo.numItems ) ; 
}
