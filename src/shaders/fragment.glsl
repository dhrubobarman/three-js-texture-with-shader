uniform float uTime;
uniform float uRadius;
uniform sampler2D uTexture;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


float drawCircle(vec2 position, vec2 center, float radius){
    return step(radius, distance(position, center));
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

void main() {
    // line: vec3(step(0.99, 1.0 - abs(vUv.y - 0.5)))
    // circle: vec3(step(uRadius, length(vUv - 0.5)))
    // vec3(drawCircle(vUv, CENTER, uRadius))

    // const vec2 CENTER = vec2(0.5);
    const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);
    vec3 color = texture2D(uTexture, vUv).xyz;

    float finalColor = dot(DESATURATE, color);

	gl_FragColor = vec4(color, 1);
}