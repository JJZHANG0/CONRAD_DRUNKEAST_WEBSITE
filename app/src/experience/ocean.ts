import * as T from "three";
export function makeOcean() {
  const uniforms = { uTime: { value: 0 }, uSubmerge: { value: 0 } };
  const material = new T.ShaderMaterial({
    uniforms,
    side: T.DoubleSide,
    vertexShader: `
    uniform float uTime; varying vec3 vWorld; varying vec3 vN;
    float wave(vec2 p){return sin(p.x*.19+uTime*.32)*.4+sin(p.y*.28+p.x*.11-uTime*.23)*.27+sin(p.x*.8+p.y*.6+uTime*.7)*.075+sin(p.x*2.4-p.y*1.7+uTime*1.1)*.027+sin(p.x*5.3+p.y*3.7-uTime*1.7)*.009;}
    void main(){vec3 p=position; p.y+=wave(p.xz); float e=.08;vN=normalize(vec3(wave(p.xz-vec2(e,0))-wave(p.xz+vec2(e,0)),2.*e,wave(p.xz-vec2(0,e))-wave(p.xz+vec2(0,e))));vWorld=(modelMatrix*vec4(p,1)).xyz; gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1);}
  `,
    fragmentShader: `
    uniform float uTime;uniform float uSubmerge;varying vec3 vWorld;varying vec3 vN;
    void main(){vec3 n=normalize(vN);vec3 viewDir=normalize(cameraPosition-vWorld);float fresnel=pow(1.-max(dot(n,viewDir),0.),3.);vec3 sun=normalize(vec3(-.4,.24,-1.));float glint=pow(max(dot(reflect(-sun,n),viewDir),0.),110.);float sheen=pow(max(dot(reflect(-sun,n),viewDir),0.),15.);vec3 color=mix(vec3(.013,.055,.073),vec3(.16,.27,.29),fresnel*.7);color+=vec3(.62,.64,.53)*glint*.85+vec3(.12,.19,.18)*sheen;float d=length(cameraPosition-vWorld);color=mix(color,vec3(.09,.16,.18),1.-exp(-d*.004));vec3 below=vec3(.025,.16,.19)*(0.65+max(n.y,0.)*.4);gl_FragColor=vec4(mix(color,below,uSubmerge),1.);}
  `,
  });
  const geometry = new T.PlaneGeometry(450, 450, 180, 180);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new T.Mesh(geometry, material);
  mesh.position.y = 14;
  const skyMat = new T.ShaderMaterial({
    side: T.BackSide,
    depthWrite: false,
    uniforms: { uDeep: { value: 0 } },
    vertexShader: `varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uDeep;varying vec3 vP;void main(){vec3 p=normalize(vP);float horizon=pow(1.-abs(p.y),4.);float cloud=sin(p.x*20.+sin(p.z*13.))*sin(p.z*24.+p.y*16.);vec3 c=mix(vec3(.045,.09,.13),vec3(.25,.34,.35),horizon*.65);c+=vec3(.04)*smoothstep(.2,.8,cloud)*smoothstep(.05,.6,p.y);gl_FragColor=vec4(mix(c,vec3(.003,.018,.029),uDeep),1.);}`,
  });
  const sky = new T.Mesh(new T.SphereGeometry(240, 32, 16), skyMat);
  const beams = new T.Group();
  for (let i = 0; i < 6; i++) {
    const mat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      blending: T.AdditiveBlending,
      uniforms: { uOpacity: { value: 0.1 } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform float uOpacity;varying vec2 vUv;void main(){float edge=pow(sin(vUv.x*3.14159),4.);float fade=pow(vUv.y,1.8)*(1.-smoothstep(.8,1.,vUv.y));gl_FragColor=vec4(.32,.55,.58,edge*fade*uOpacity);}`,
    });
    const cone = new T.Mesh(
      new T.ConeGeometry(3 + i * 0.5, 42, 24, 1, true),
      mat,
    );
    cone.position.set(-20 + i * 7, -3, -12 - i * 3);
    cone.rotation.z = -0.18;
    beams.add(cone);
  }
  return {
    mesh,
    sky,
    beams,
    update(time: number, depth: number) {
      uniforms.uTime.value = time;
      uniforms.uSubmerge.value = T.MathUtils.smoothstep(depth, 0, 2);
      skyMat.uniforms.uDeep.value = T.MathUtils.smoothstep(depth, 0, 4);
      beams.visible = depth > 0;
    },
  };
}
