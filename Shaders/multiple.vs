attribute vec3 aPosition ;
attribute vec4 aColor ; 
attribute vec3 aNormal ;
attribute vec3 aTangent ;
attribute vec3 aBitangent ;
attribute vec2 aTexcoords ;

uniform mat4 uProjectionMatrix ;
uniform mat4 uModelViewMatrix ;
uniform mat4 uNormalMatrix ;

varying vec4 vColor ;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec2 vTexcoords;

void main( void )
{
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4( aPosition , 1.0 ) ;
  vColor      = aColor ;  
  vNormal = (uNormalMatrix * vec4(aNormal,0)).xyz;
  vTangent = (uNormalMatrix * vec4(aTangent,0)).xyz;
  vBitangent = (uNormalMatrix * vec4(aBitangent,0)).xyz;
  vTexcoords = aTexcoords;
}
