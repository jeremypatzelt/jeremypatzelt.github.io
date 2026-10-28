/* Flowing Lagoon backdrop (WebGL). Draws into <canvas id="lake">. */
(function () {
  var cv = document.getElementById('lake');
  if (!cv) return;
  var gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs = [
    'precision highp float;',
    'uniform vec2 R;uniform float T;',
    'const vec3 C0=vec3(.03,.04,.30);const vec3 C1=vec3(.22,.33,1.0);const vec3 C2=vec3(.66,.38,1.0);const vec3 C3=vec3(.55,.78,1.0);',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}',
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+17.;a*=.5;}return s;}',
    'float terrain(vec2 p){',
    '  vec2 w=vec2(fbm(p*.22+T*.05),fbm(p*.22+7.3-T*.04));',
    '  p+=(w-.5)*2.2;',
    '  float r=1.-abs(2.*fbm(p*.30)-1.);',
    '  float h=pow(r,2.2)*1.15+fbm(p*.9+T*.03)*.30;',
    '  return h*.9;}',
    'vec3 pal(float x){x=clamp(x,0.,1.);',
    '  vec3 c=mix(C0,C1,smoothstep(0.,.4,x));c=mix(c,C2,smoothstep(.35,.7,x));return mix(c,C3,smoothstep(.65,1.,x));}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;',
    '  vec3 ro=vec3(sin(T*.07)*.8,2.1,T*.55);',
    '  vec3 rd=normalize(vec3(uv.x,uv.y-.16,1.1));',
    '  vec3 col=vec3(.012,.012,.04);',
    '  float t=.8;vec3 acc=vec3(0.);',
    '  for(int i=0;i<72;i++){',
    '    if(rd.y>0.)break;',
    '    vec3 p=ro+rd*t;float h=terrain(p.xz);float d=p.y-h;',
    '    float fog=exp(-t*.045);',
    '    float g=exp(-abs(d)*7.)+.18*exp(-max(-d,0.)*1.2);',
    '    vec3 pc=pal(h*.75+.1*sin(p.z*.15+T*.2)+.15);',
    '    float stp=.05+t*.065;',
    '    acc+=pc*pc*g*fog*stp*(.22+h*.5);',
    '    t+=stp;',
    '    if(t>60.)break;}',
    '  col+=acc;',
    '  float hz=exp(-abs(rd.y+.02)*16.);col+=mix(C0,C1,.6)*hz*.28;',
    '  float vg=smoothstep(1.3,.2,length(uv*vec2(.7,1.)));col*=.55+.45*vg;',
    '  col=1.-exp(-col*1.1);',
    '  gl_FragColor=vec4(pow(col,vec3(.92)),1.);}'
  ].join('\n');

  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);

  var b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T');

  var scale = 0.6, time = 20, last = performance.now(), run = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
    cv.width = Math.max(2, Math.floor(innerWidth * d));
    cv.height = Math.max(2, Math.floor(innerHeight * d));
    gl.viewport(0, 0, cv.width, cv.height);
  }
  size();
  addEventListener('resize', size);

  function frame(now) {
    if (!run) return;
    var dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (cv.offsetWidth > 0) {            /* skip drawing while hidden (light mode) */
      if (!reduce) time += dt;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () {
    run = !document.hidden; last = performance.now();
    if (run) requestAnimationFrame(frame);
  });
  requestAnimationFrame(frame);
})();
