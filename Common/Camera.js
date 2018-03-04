/*
 * Perspective camera class
 * 
 */
function Camera( eyePos , centerPos , up , width , height , fov , near , far )
{
	this.eyePos = eyePos ; 
	this.centerPos = centerPos ; 
	this.up = up ; 
	this.width = width ; 
	this.height = height ; 
	this.fov = fov || 45 ; 
	this.near = near || 0.1 ;
	this.far = far || 1000.0 ;
	
	this.view_matrix = null ;
	this.projection_matrix = null ;
	
	this.ComputeMatrices() ; 
};


/**
 * Compute View and Projection Matrices
 */
Camera.prototype.ComputeMatrices = function( )
{
    this.view_matrix = new Matrix( this.eyePos ,
	                           this.centerPos,
	                           this.up ) ;
    
    this.projection_matrix = new Matrix( Matrix.prototype.deg_to_rad(this.fov) , 
					 this.width / this.height , 
					 this.near , this.far ) ; 	 
};

/**
 * Get View Matrix
 */
Camera.prototype.GetViewMatrix = function()
{
    return this.view_matrix ; 
};

/**
 * Get Projection Matrix
 */
Camera.prototype.GetProjectionMatrix = function()
{
    return this.projection_matrix ; 
};

/**
* Set Current Field Of View
*/
Camera.prototype.SetFov = function( aFov )
{
    this.fov = aFov ; 
    this.ComputeMatrices() ; 
};
