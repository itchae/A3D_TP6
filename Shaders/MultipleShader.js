// All shaders must inherit from Shader object 
MultipleShader.prototype = Object.create( Shader.prototype );
MultipleShader.prototype.constructor = MultipleShader ;

/* constructor */
function MultipleShader( gl ) {
    Shader.call( this , "multiple",  "./Shaders/multiple.vs", "./Shaders/multiple.fs", 
		 gl, MultipleShader.prototype.attributes ) ;

    this.mode = 0;
} ;

MultipleShader.prototype.attributes = [
    AttributeEnum.position, AttributeEnum.color, AttributeEnum.normal,
    AttributeEnum.tangent, AttributeEnum.bitangent, AttributeEnum.texcoord
];

MultipleShader.prototype.setAttributes = function ( vbo ) 
{
    gl.bindBuffer( gl.ARRAY_BUFFER , vbo ) ;    
    
    var size = 18*4; // 72

    // Get Position attribute: +12
    var attr_pos = this.GetAttributeLocation( "aPosition" ) ; 
    gl.enableVertexAttribArray( attr_pos ) ; 
    gl.vertexAttribPointer( attr_pos , 3 , gl.FLOAT , false , size , 0 ) ; 
    
    // Get Color attribute: +16
    var attr_col = this.GetAttributeLocation( "aColor" ) ; 
    gl.enableVertexAttribArray( attr_col ) ; 
    gl.vertexAttribPointer( attr_col , 4 , gl.FLOAT , false , size , 12 ) ;

    // Get normal attribute: +12
    var attr_nor = this.GetAttributeLocation( "aNormal" ) ; 
    gl.enableVertexAttribArray( attr_nor ) ; 
    gl.vertexAttribPointer( attr_nor , 3 , gl.FLOAT , false , size , 28 ) ;

    // Get tangent attribute: +12
    var attr_tan = this.GetAttributeLocation( "aTangent" ) ; 
    gl.enableVertexAttribArray( attr_tan ) ; 
    gl.vertexAttribPointer( attr_tan , 3 , gl.FLOAT , false , size , 40 ) ;

    // Get bitangent attribute: +12
    var attr_bit = this.GetAttributeLocation( "aBitangent" ) ; 
    gl.enableVertexAttribArray( attr_bit ) ; 
    gl.vertexAttribPointer( attr_bit , 3 , gl.FLOAT , false , size , 52 ) ;

    // Get texcoords attribute: +8
    var attr_tex = this.GetAttributeLocation( "aTexcoords" ) ; 
    gl.enableVertexAttribArray( attr_tex ) ; 
    gl.vertexAttribPointer( attr_tex , 2 , gl.FLOAT , false , size , 64 ) ;


    var uloc = this.GetUniformLocation( "uMode" );
    gl.uniform1i( uloc, this.mode );
} ;


MultipleShader.prototype.SetMode = function( mode ) {
    if( mode < 5 ) this.mode = mode;
};


