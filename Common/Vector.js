/** Vector
 * Simple 3 dimensional Vector class 
 */
Vector.prototype = new Object();
Vector.prototype.constructor = Vector;

var VEC_ARRAY_TYPE = (typeof Float32Array == 'undefined' ) ? Array : Float32Array ;

// Default constructor ...
// Warning: deduce the usage examining argument ...
function Vector()
{
    this.m = new VEC_ARRAY_TYPE(3);
    switch (arguments.length) {
    case 0: return this.defaultConstructor();
    case 1: return this.copyConstructor(arguments[0]);
    case 3: return this.coordinateConstructor(arguments[0], arguments[1], arguments[2]);
    default: throw "Vector constructor bad syntax";
    };
    return this;
} ;

// Default constructor (no argument)
Vector.prototype.defaultConstructor = function() 
{
    this.m[0] = 0;
    this.m[1] = 0;
    this.m[2] = 0;
    return this;
};

// Copy constructor (on argument, another vector)
Vector.prototype.copyConstructor = function(that) 
{
    if(!(that instanceof Vector)) 
	throw("Vector: bad copy constructor call");
    this.m[0] = that.m[0];
    this.m[1] = that.m[1];
    this.m[2] = that.m[2];
    return this;
};

// Constructor using three coordinates (float values)
Vector.prototype.coordinateConstructor = function(x,y,z) 
{
    if( isFinite(x) && isFinite(y) && isFinite(z) ) {
	this.m[0] = x ;
	this.m[1] = y ; 
	this.m[2] = z ; 
	return this;
    }
    else
	throw "Vector: bad (by coordinate) constructor call ("+x+","+y+","+z+")";
};

// getter
Vector.prototype.X = function()
{
  return this.m[0] ;
} ;

// getter
Vector.prototype.Y = function()
{
  return this.m[1] ;
} ;

// getter
Vector.prototype.Z = function()
{
  return this.m[2] ; 
} ;

// Addition (this += that)
Vector.prototype.Add = function( that ) 
{
    this.m[0] += that.m[0];
    this.m[1] += that.m[1];
    this.m[2] += that.m[2];
    return this;
} ;

// Subtraction (this -= that)
Vector.prototype.Sub = function( that ) 
{
    this.m[0] -= that.m[0];
    this.m[1] -= that.m[1];
    this.m[2] -= that.m[2];
    return this;
} ;

// Cross product (returns = this ^ that)
Vector.prototype.Cross = function( that )
{
    return new Vector( this.m[1]*that.m[2] - this.m[2]*that.m[1],
		       this.m[2]*that.m[0] - this.m[0]*that.m[2],
		       this.m[0]*that.m[1] - this.m[1]*that.m[0] );
}

// Dot product
Vector.prototype.Dot = function( that ) 
{
  return this.m[0]*that.m[0] + this.m[1]*that.m[1] + this.m[2]*that.m[2] ;
}

// Multiplication by a scalar (this *= scalar)
Vector.prototype.Mul = function( that ) 
{
    if(isFinite(that)) {
	this.m[0] *= that;
	this.m[1] *= that;
	this.m[2] *= that;
	return this;
    }
    else 
	throw("Vector.mul: bad parameter");
} ;

// Normalization: this becomes unit vector
Vector.prototype.Normalize = function()
{
    var inv = 1.0 / Math.sqrt( this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2] ) ;
    this.m[0] *= inv ;
    this.m[1] *= inv ;
    this.m[2] *= inv ;
    return this;
} ;

// Returns the opposite
Vector.prototype.Invert = function() 
{
    this.m[0] = -this.m[0];
    this.m[1] = -this.m[1];
    this.m[2] = -this.m[2];
    return this;
}

// Rotate a vector given an angle (in radian) around Z axis
Vector.prototype.RotateX = function( rad ) 
{
    return new Vector( this.m[0], 
		       this.m[1]*Math.cos( rad ), 
		       this.m[2]*Math.sin( rad ) );
}

// Rotate a vector given an angle (in radian) around Z axis
Vector.prototype.RotateY = function( rad ) 
{
    return new Vector( this.m[0]*Math.sin( rad ), 
		       this.m[1], 
		       this.m[2]*Math.cos( rad ) );
}

// Rotate a vector given an angle (in radian) around Z axis
Vector.prototype.RotateZ = function( rad ) 
{
    return new Vector( this.m[0]*Math.cos( rad ), 
		       this.m[1]*Math.sin( rad ), 
		       this.m[2] );
}

// Returns the data to the GPU
Vector.prototype.GetGLVector = function()
{
    return this.m ; 
} ;

// Returns a string to display a vector
Vector.prototype.toString = function() {
    return "[ "+this.m[0]+"; "+this.m[1]+"; "+this.m[2]+" ]";
};
