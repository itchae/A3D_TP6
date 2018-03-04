precision mediump float;

uniform int uMode;
 
varying vec4 vColor ;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec2 vTexcoords;

void main(void)
{
  if( uMode == 0 ) {
    gl_FragColor = vColor * clamp(abs(dot(vec3(0,0,1),normalize(vNormal))),0.1,1.0);
  }
  else if( uMode == 1 ) {
    gl_FragColor = vec4( abs(normalize( vNormal )), 1.0 );
  }
  else if( uMode == 2 ) {
    gl_FragColor = vec4( abs(normalize( vTangent )), 1.0 );
  }
  else if( uMode == 3 ) {
    gl_FragColor = vec4( abs(normalize( vBitangent )), 1.0 );
  }
  else if( uMode == 4 ) {
    gl_FragColor = vec4( abs(normalize( vTexcoords )), 0.0, 1.0 );
  }
}
