// 3D Furry Mascot (WebGL, no dependencies). Original mascot engine ported from furry_mascot_3d.html
export function createMascot(canvas, options = {}) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
  if (!gl) return null;
  const reduced = !!options.reducedMotion;
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vsSource = `
      attribute vec3 a_position;
      attribute vec3 a_normal;

      uniform mat4 u_projection;
      uniform mat4 u_view;
      uniform mat4 u_model;
      uniform mat3 u_normalMat;

      varying vec3 v_normal;
      varying vec3 v_worldPos;

      void main() {
        vec4 worldPos = u_model * vec4(a_position, 1.0);
        v_worldPos = worldPos.xyz;
        v_normal = normalize(u_normalMat * a_normal);
        gl_Position = u_projection * u_view * worldPos;
      }
    `;

    const fsSource = `
      precision mediump float;

      varying vec3 v_normal;
      varying vec3 v_worldPos;

      uniform vec3 u_camPos;
      uniform vec3 u_color;
      uniform float u_roughness;
      uniform float u_isUnlit;
      uniform float u_isFurry;
      uniform float u_opacity;

      // Neon Lighting Uniforms
      uniform float u_neonActive;
      uniform vec3 u_neonColor;
      uniform float u_neonPulse;

      void main() {
        if (u_isUnlit > 0.5) {
          // Pure emissive glow for neon tubes
          gl_FragColor = vec4(u_color, u_opacity);
          return;
        }

        vec3 N = normalize(v_normal);
        vec3 V = normalize(u_camPos - v_worldPos);

        // 3-Point Studio Lights
        vec3 keyDir = normalize(vec3(3.2, 4.5, 3.8));
        vec3 fillDir = normalize(vec3(-3.8, 1.2, 2.2));
        vec3 rimDir = normalize(vec3(0.0, 3.5, -4.5));

        float keyDiff = max(dot(N, keyDir), 0.0);
        float fillDiff = max(dot(N, fillDir), 0.0);

        // Rim / Sheen for Velvet/Plush Fur Edge
        float fresnel = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 2.6);
        float rim = fresnel * max(dot(N, rimDir) + 0.3, 0.0) * (u_isFurry > 0.5 ? 2.5 : 0.6);

        // Specular for Shiny Eyes
        float spec = 0.0;
        if (u_roughness < 0.15) {
          vec3 H = normalize(keyDir + V);
          spec = pow(max(dot(N, H), 0.0), 48.0) * 1.6;
        }

        vec3 ambient = vec3(0.42, 0.28, 0.32);
        vec3 keyLight = vec3(1.0, 0.96, 0.92) * keyDiff * 1.15;
        vec3 fillLight = vec3(1.0, 0.85, 0.90) * fillDiff * 0.45;
        vec3 rimLight = vec3(1.0, 0.70, 0.75) * rim;

        // DYNAMIC NEON LIGHT REFLECTION ON FUR!
        vec3 neonBounce = vec3(0.0);
        if (u_neonActive > 0.5) {
          // Dim standard ambient slightly to emphasize cyberpunk contrast
          ambient *= 0.65;
          keyLight *= 0.85;

          // Overhead Neon Halo light bounce
          vec3 haloDir = normalize(vec3(0.0, 1.0, 0.0));
          float haloDiff = max(dot(N, haloDir), 0.0);
          neonBounce += u_neonColor * haloDiff * (0.6 * u_neonPulse);

          // Extra Neon Rim Glow along edges
          neonBounce += u_neonColor * fresnel * (1.8 * u_neonPulse);
        }

        vec3 col = u_color * (ambient + keyLight + fillLight) + rimLight + vec3(spec) + neonBounce;
        gl_FragColor = vec4(col, u_opacity);
      }
    `;

    function createShader(gl, type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Uniform Locations
    const uProjLoc = gl.getUniformLocation(program, 'u_projection');
    const uViewLoc = gl.getUniformLocation(program, 'u_view');
    const uModelLoc = gl.getUniformLocation(program, 'u_model');
    const uNormMatLoc = gl.getUniformLocation(program, 'u_normalMat');
    const uCamPosLoc = gl.getUniformLocation(program, 'u_camPos');
    const uColorLoc = gl.getUniformLocation(program, 'u_color');
    const uRoughnessLoc = gl.getUniformLocation(program, 'u_roughness');
    const uIsUnlitLoc = gl.getUniformLocation(program, 'u_isUnlit');
    const uIsFurryLoc = gl.getUniformLocation(program, 'u_isFurry');
    const uOpacityLoc = gl.getUniformLocation(program, 'u_opacity');

    const uNeonActiveLoc = gl.getUniformLocation(program, 'u_neonActive');
    const uNeonColorLoc = gl.getUniformLocation(program, 'u_neonColor');
    const uNeonPulseLoc = gl.getUniformLocation(program, 'u_neonPulse');

    const aPosLoc = gl.getAttribLocation(program, 'a_position');
    const aNormLoc = gl.getAttribLocation(program, 'a_normal');

    const Mat4 = {
      create: () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
      perspective: (fovy, aspect, near, far) => {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);
        return new Float32Array([
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (far + near) * nf, -1,
          0, 0, 2 * far * near * nf, 0
        ]);
      },
      lookAt: (eye, center, up) => {
        let z0 = eye[0] - center[0], z1 = eye[1] - center[1], z2 = eye[2] - center[2];
        let len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len; z1 *= len; z2 *= len;
        let x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
        len = 1 / Math.hypot(x0, x1, x2);
        x0 *= len; x1 *= len; x2 *= len;
        let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
        return new Float32Array([
          x0, y0, z0, 0,
          x1, y1, z1, 0,
          x2, y2, z2, 0,
          -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]),
          -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
          -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
          1
        ]);
      },
      multiply: (a, b) => {
        let out = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            out[i * 4 + j] = a[j] * b[i * 4] + a[4 + j] * b[i * 4 + 1] + a[8 + j] * b[i * 4 + 2] + a[12 + j] * b[i * 4 + 3];
          }
        }
        return out;
      },
      translate: (m, v) => {
        let t = Mat4.create();
        t[12] = v[0]; t[13] = v[1]; t[14] = v[2];
        return Mat4.multiply(m, t);
      },
      scale: (m, v) => {
        let s = Mat4.create();
        s[0] = v[0]; s[5] = v[1]; s[10] = v[2];
        return Mat4.multiply(m, s);
      },
      rotateX: (m, rad) => {
        let r = Mat4.create();
        let c = Math.cos(rad), s = Math.sin(rad);
        r[5] = c; r[6] = s; r[9] = -s; r[10] = c;
        return Mat4.multiply(m, r);
      },
      rotateY: (m, rad) => {
        let r = Mat4.create();
        let c = Math.cos(rad), s = Math.sin(rad);
        r[0] = c; r[2] = -s; r[8] = s; r[10] = c;
        return Mat4.multiply(m, r);
      },
      rotateZ: (m, rad) => {
        let r = Mat4.create();
        let c = Math.cos(rad), s = Math.sin(rad);
        r[0] = c; r[1] = s; r[4] = -s; r[5] = c;
        return Mat4.multiply(m, r);
      },
      normalMat: (m) => {
        return new Float32Array([
          m[0], m[1], m[2],
          m[4], m[5], m[6],
          m[8], m[9], m[10]
        ]);
      }
    };

    function buildBuffer(positions, normals, indices) {
      const pBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const nBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

      const iBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      return { pBuf, nBuf, iBuf, count: indices.length };
    }

    // 1. Smooth Sphere
    function createSphere(radius, latBands = 32, lonBands = 32, deformFn = null) {
      const positions = [], normals = [], indices = [];
      for (let lat = 0; lat <= latBands; lat++) {
        const theta = (lat * Math.PI) / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= lonBands; lon++) {
          const phi = (lon * 2 * Math.PI) / lonBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          let x = cosPhi * sinTheta;
          let y = cosTheta;
          let z = sinPhi * sinTheta;

          let px = x * radius;
          let py = y * radius;
          let pz = z * radius;

          if (deformFn) {
            const deformed = deformFn(px, py, pz);
            px = deformed.x; py = deformed.y; pz = deformed.z;
          }

          normals.push(x, y, z);
          positions.push(px, py, pz);
        }
      }

      for (let lat = 0; lat < latBands; lat++) {
        for (let lon = 0; lon < lonBands; lon++) {
          const first = lat * (lonBands + 1) + lon;
          const second = first + lonBands + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }
      return buildBuffer(positions, normals, indices);
    }

    // 2. Cone for Ears & Megaphone
    function createCone(radius, height, segments = 32) {
      const positions = [], normals = [], indices = [];
      positions.push(0, height, 0);
      normals.push(0, 1, 0);

      for (let i = 0; i <= segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        positions.push(x, 0, z);

        const nx = Math.cos(a);
        const nz = Math.sin(a);
        const ny = radius / height;
        const len = Math.hypot(nx, ny, nz);
        normals.push(nx / len, ny / len, nz / len);
      }

      for (let i = 1; i <= segments; i++) {
        indices.push(0, i, i + 1);
      }
      return buildBuffer(positions, normals, indices);
    }

    // 3. Cylinder
    function createCylinder(rTop, rBot, height, segments = 24) {
      const positions = [], normals = [], indices = [];
      const halfH = height / 2;

      for (let i = 0; i <= segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        const cosA = Math.cos(a), sinA = Math.sin(a);

        positions.push(cosA * rTop, halfH, sinA * rTop);
        normals.push(cosA, 0, sinA);

        positions.push(cosA * rBot, -halfH, sinA * rBot);
        normals.push(cosA, 0, sinA);
      }

      for (let i = 0; i < segments; i++) {
        const i1 = i * 2;
        const i2 = i1 + 1;
        const i3 = (i + 1) * 2;
        const i4 = i3 + 1;
        indices.push(i1, i2, i3);
        indices.push(i2, i4, i3);
      }
      return buildBuffer(positions, normals, indices);
    }

    // 4. Ground Shadow Disc
    function createDisc(radius, segments = 32) {
      const positions = [0, 0, 0], normals = [0, 1, 0], indices = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        positions.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
        normals.push(0, 1, 0);
      }
      for (let i = 1; i <= segments; i++) {
        indices.push(0, i, i + 1);
      }
      return buildBuffer(positions, normals, indices);
    }

    // 5. Curved Torus Arc
    function createCurvedArc(majorRadius, minorRadius, arcAngle, segments = 24) {
      const positions = [], normals = [], indices = [];
      const tubeSegs = 12;
      const startA = -arcAngle / 2;
      const stepA = arcAngle / segments;

      for (let i = 0; i <= segments; i++) {
        const a = startA + i * stepA;
        const cx = Math.sin(a) * majorRadius;
        const cy = -Math.cos(a) * majorRadius + majorRadius;
        const nx = Math.sin(a);
        const ny = -Math.cos(a);

        for (let j = 0; j <= tubeSegs; j++) {
          const phi = (j * 2 * Math.PI) / tubeSegs;
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          const px = cx + nx * cosPhi * minorRadius;
          const py = cy + ny * cosPhi * minorRadius;
          const pz = sinPhi * minorRadius;

          positions.push(px, py, pz);
          normals.push(nx * cosPhi, ny * cosPhi, sinPhi);
        }
      }

      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < tubeSegs; j++) {
          const first = i * (tubeSegs + 1) + j;
          const second = first + tubeSegs + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }
      return buildBuffer(positions, normals, indices);
    }


    const meshBody = createSphere(1.28, 36, 36, (x, y, z) => {
      const bottom = 1.0 + Math.max(0, -y / 1.28) * 0.18;
      return { x: x * bottom, y: y * 0.94, z: z * bottom };
    });

    const meshFaceLobe = createSphere(0.48, 24, 24);
    const meshFaceBridge = createSphere(0.32, 16, 16);
    const meshEye = createSphere(0.36, 28, 28);
    const meshCatchBig = createSphere(0.10, 16, 16);
    const meshCatchSmall = createSphere(0.045, 12, 12);
    const meshNose = createSphere(0.065, 16, 16);

    const meshMouthCavity = createSphere(0.12, 24, 24, (x, y, z) => {
      let newY = y;
      if (y > 0.0) newY *= 0.55;
      return { x: x * 1.35, y: newY, z: z * 0.5 };
    });
    const meshTongue = createSphere(0.075, 16, 16, (x, y, z) => {
      return { x: x * 1.1, y: y * 0.65, z: z * 0.8 };
    });
    const meshCatSmileArc = createCurvedArc(0.08, 0.018, Math.PI * 0.85, 16);

    const meshEarOuter = createCone(0.38, 0.65, 24);
    const meshEarInner = createCone(0.24, 0.45, 20);

    const meshArm = createSphere(0.24, 24, 24);
    const meshLeg = createSphere(0.32, 24, 24);

    const meshHorn = createCone(0.45, 0.75, 24);
    const meshHornBase = createCylinder(0.15, 0.15, 0.3, 16);
    const meshHandle = createCylinder(0.06, 0.06, 0.4, 12);

    const meshShadow = createDisc(1.5, 32);

    function drawMesh(mesh, modelMat, color, roughness = 0.8, isUnlit = 0.0, isFurry = 0.0, opacity = 1.0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pBuf);
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nBuf);
      gl.enableVertexAttribArray(aNormLoc);
      gl.vertexAttribPointer(aNormLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.iBuf);

      gl.uniformMatrix4fv(uModelLoc, false, modelMat);
      gl.uniformMatrix3fv(uNormMatLoc, false, Mat4.normalMat(modelMat));
      gl.uniform3fv(uColorLoc, color);
      gl.uniform1f(uRoughnessLoc, roughness);
      gl.uniform1f(uIsUnlitLoc, isUnlit);
      gl.uniform1f(uIsFurryLoc, isFurry);
      gl.uniform1f(uOpacityLoc, opacity);

      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }

  // --- state ---
  let pose = options.pose ?? 0;
  let mouthStyle = options.mouth ?? 'open';
  let sway = options.sway ?? true;
  let zoom = options.zoom ?? 5.6;
  let mouseX = 0, mouseY = 0;
  let tempPoseTimer = null;
  let running = true;
  let rafId = 0;
  const isNeonActive = false;
  const neonColor = [0, 0.94, 1];
  const isRainbow = false;
  const colBody = options.bodyColor ?? [0.90, 0.18, 0.18];
  const colLimbs = options.limbColor ?? [0.72, 0.11, 0.11];
  const colMask = options.maskColor ?? [0.98, 0.85, 0.87];
  let rotX = 0, rotY = 0, targetRotX = 0, targetRotY = 0, autoRotate = false;
  const startTime = performance.now();

  function onMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2.0 - 1.0;
    mouseY = -(e.clientY / window.innerHeight) * 2.0 + 1.0;
  }
  window.addEventListener('mousemove', onMove, { passive: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 300, h = canvas.clientHeight || 300;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();

  function hsvToRgb() { return neonColor; }

    function render() {
      const t = (performance.now() - startTime) * 0.001;

      // Auto rotation
      if (autoRotate && pose === 0) {
        targetRotX += 0.006;
      }

      // Smooth damping
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      // Cursor parallax
      const swayX = (sway && !reduced) ? Math.sin(t * 0.7) * 0.4 : 0;
      const curX = rotX + swayX + mouseX * 0.25;
      const curY = rotY - mouseY * 0.08;

      // Clear Canvas
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Camera Matrices
      const aspect = canvas.width / canvas.height;
      const projMat = Mat4.perspective((38 * Math.PI) / 180, aspect, 0.1, 100);
      const camPos = [0, 0.2, zoom];
      const viewMat = Mat4.lookAt(camPos, [0, 0, 0], [0, 1, 0]);

      gl.uniformMatrix4fv(uProjLoc, false, projMat);
      gl.uniformMatrix4fv(uViewLoc, false, viewMat);
      gl.uniform3fv(uCamPosLoc, camPos);

      // Active Neon Color & Breathing Pulse
      let currentNeonColor = neonColor;
      if (isRainbow) {
        currentNeonColor = hsvToRgb((t * 0.2) % 1.0, 0.95, 1.0);
      }
      const neonPulse = isNeonActive ? (0.85 + Math.sin(t * 5.0) * 0.15) : 0.0;

      gl.uniform1f(uNeonActiveLoc, isNeonActive ? 1.0 : 0.0);
      gl.uniform3fv(uNeonColorLoc, currentNeonColor);
      gl.uniform1f(uNeonPulseLoc, neonPulse);

      // Mascot Root Transform
      let rootMat = Mat4.create();

      // Idle Bounce & Breathe
      const bounce = Math.sin(t * 3.0) * (reduced ? 0 : 0.06);
      rootMat = Mat4.translate(rootMat, [0, bounce, 0]);
      rootMat = Mat4.rotateY(rootMat, curX);
      rootMat = Mat4.rotateX(rootMat, curY);

      // 0. Contact Shadow on ground
      let shadowMat = Mat4.create();
      shadowMat = Mat4.translate(shadowMat, [0, -1.40, 0]);
      shadowMat = Mat4.scale(shadowMat, [1.0 + bounce * 0.5, 1.0, 1.0 + bounce * 0.5]);
      drawMesh(meshShadow, shadowMat, isNeonActive ? [0.08, 0.01, 0.04] : [0.45, 0.05, 0.10], 1.0, 1.0, 0.0, isNeonActive ? 0.6 : 0.35);


      // 1. Chubby Body (Plush Fur)
      let bodyMat = Mat4.create();
      const squish = Math.sin(t * 3.0) * (reduced ? 0 : 0.02);
      bodyMat = Mat4.multiply(rootMat, bodyMat);
      bodyMat = Mat4.scale(bodyMat, [1.0 + squish * 0.5, 1.0 - squish, 1.0 + squish * 0.5]);
      drawMesh(meshBody, bodyMat, colBody, 0.88, 0.0, 1.0);

      // 2. Face Mask (Soft Pink Figure-8 around eyes)
      // Left Lobe
      let maskLMat = Mat4.create();
      maskLMat = Mat4.translate(maskLMat, [-0.38, 0.14, 1.05]);
      maskLMat = Mat4.scale(maskLMat, [1.0, 0.85, 0.45]);
      maskLMat = Mat4.multiply(rootMat, maskLMat);
      drawMesh(meshFaceLobe, maskLMat, colMask, 0.75, 0.0, 0.5);

      // Right Lobe
      let maskRMat = Mat4.create();
      maskRMat = Mat4.translate(maskRMat, [0.38, 0.14, 1.05]);
      maskRMat = Mat4.scale(maskRMat, [1.0, 0.85, 0.45]);
      maskRMat = Mat4.multiply(rootMat, maskRMat);
      drawMesh(meshFaceLobe, maskRMat, colMask, 0.75, 0.0, 0.5);

      // Mask Center Bridge
      let bridgeMat = Mat4.create();
      bridgeMat = Mat4.translate(bridgeMat, [0, 0.14, 1.12]);
      bridgeMat = Mat4.scale(bridgeMat, [1.2, 0.8, 0.4]);
      bridgeMat = Mat4.multiply(rootMat, bridgeMat);
      drawMesh(meshFaceBridge, bridgeMat, colMask, 0.75, 0.0, 0.5);

      // 3. Eyes & Blinking
      const blinkCycle = t % 4.0;
      let blinkScale = 1.0;
      if (blinkCycle > 3.6 && blinkCycle < 3.8) {
        blinkScale = Math.max(0.08, Math.abs(blinkCycle - 3.7) / 0.1);
      }

      // Left Eye
      let eyeLMat = Mat4.create();
      eyeLMat = Mat4.translate(eyeLMat, [-0.40, 0.18, 1.15]);
      eyeLMat = Mat4.scale(eyeLMat, [0.95, 1.05 * blinkScale, 0.65]);
      eyeLMat = Mat4.multiply(rootMat, eyeLMat);
      drawMesh(meshEye, eyeLMat, [0.06, 0.01, 0.02], 0.02, 0.0, 0.0);

      // Right Eye
      let eyeRMat = Mat4.create();
      eyeRMat = Mat4.translate(eyeRMat, [0.40, 0.18, 1.15]);
      eyeRMat = Mat4.scale(eyeRMat, [0.95, 1.05 * blinkScale, 0.65]);
      eyeRMat = Mat4.multiply(rootMat, eyeRMat);
      drawMesh(meshEye, eyeRMat, [0.06, 0.01, 0.02], 0.02, 0.0, 0.0);

      // 4. White Specular Catchlights (Anime Highlights)
      if (blinkScale > 0.4) {
        // Left Eye Catchlights
        let c1L = Mat4.create();
        c1L = Mat4.translate(c1L, [-0.28, 0.28, 1.34]);
        c1L = Mat4.multiply(rootMat, c1L);
        drawMesh(meshCatchBig, c1L, [1, 1, 1], 0.0, 1.0, 0.0);

        let c2L = Mat4.create();
        c2L = Mat4.translate(c2L, [-0.50, 0.08, 1.32]);
        c2L = Mat4.multiply(rootMat, c2L);
        drawMesh(meshCatchSmall, c2L, [1, 1, 1], 0.0, 1.0, 0.0);

        // Right Eye Catchlights
        let c1R = Mat4.create();
        c1R = Mat4.translate(c1R, [0.52, 0.28, 1.34]);
        c1R = Mat4.multiply(rootMat, c1R);
        drawMesh(meshCatchBig, c1R, [1, 1, 1], 0.0, 1.0, 0.0);

        let c2R = Mat4.create();
        c2R = Mat4.translate(c2R, [0.30, 0.08, 1.32]);
        c2R = Mat4.multiply(rootMat, c2R);
        drawMesh(meshCatchSmall, c2R, [1, 1, 1], 0.0, 1.0, 0.0);
      }

      // 5. Nose (Cute tiny rounded dark bean)
      let noseMat = Mat4.create();
      noseMat = Mat4.translate(noseMat, [0, -0.05, 1.36]);
      noseMat = Mat4.scale(noseMat, [1.2, 0.85, 0.75]);
      noseMat = Mat4.multiply(rootMat, noseMat);
      drawMesh(meshNose, noseMat, [0.08, 0.02, 0.03], 0.4, 0.0, 0.0);

      // 6. Mouth Rendering
      const effectiveMouth = (pose === 1) ? 'open' : mouthStyle;
      const mouthScale = (pose === 1) ? 1.3 : 1.0;

      if (effectiveMouth === 'open') {
        // Mouth Cavity
        let cavityMat = Mat4.create();
        cavityMat = Mat4.translate(cavityMat, [0, -0.16, 1.34]);
        cavityMat = Mat4.scale(cavityMat, [0.95 * mouthScale, 0.85 * mouthScale, 0.45]);
        cavityMat = Mat4.rotateX(cavityMat, 0.1);
        cavityMat = Mat4.multiply(rootMat, cavityMat);
        drawMesh(meshMouthCavity, cavityMat, [0.09, 0.02, 0.03], 0.5, 0.0, 0.0);

        // Cute Pink Tongue
        let tongueMat = Mat4.create();
        tongueMat = Mat4.translate(tongueMat, [0, -0.19, 1.35]);
        tongueMat = Mat4.scale(tongueMat, [0.95 * mouthScale, 0.8 * mouthScale, 0.6]);
        tongueMat = Mat4.multiply(rootMat, tongueMat);
        drawMesh(meshTongue, tongueMat, [1.0, 0.48, 0.60], 0.4, 0.0, 0.0);

        // Upper lip
        let upperLipMat = Mat4.create();
        upperLipMat = Mat4.translate(upperLipMat, [0, -0.12, 1.35]);
        upperLipMat = Mat4.scale(upperLipMat, [1.1 * mouthScale, 0.25, 0.2]);
        upperLipMat = Mat4.multiply(rootMat, upperLipMat);
        drawMesh(meshNose, upperLipMat, [0.08, 0.02, 0.03], 0.5, 0.0, 0.0);

      } else {
        // Cute Cat Smile (:3)
        let catL = Mat4.create();
        catL = Mat4.translate(catL, [-0.075, -0.14, 1.34]);
        catL = Mat4.rotateZ(catL, 0.18);
        catL = Mat4.multiply(rootMat, catL);
        drawMesh(meshCatSmileArc, catL, [0.08, 0.02, 0.03], 0.5, 0.0, 0.0);

        let catR = Mat4.create();
        catR = Mat4.translate(catR, [0.075, -0.14, 1.34]);
        catR = Mat4.rotateZ(catR, -0.18);
        catR = Mat4.multiply(rootMat, catR);
        drawMesh(meshCatSmileArc, catR, [0.08, 0.02, 0.03], 0.5, 0.0, 0.0);

        let centerDip = Mat4.create();
        centerDip = Mat4.translate(centerDip, [0, -0.11, 1.345]);
        centerDip = Mat4.scale(centerDip, [0.35, 0.35, 0.35]);
        centerDip = Mat4.multiply(rootMat, centerDip);
        drawMesh(meshNose, centerDip, [0.08, 0.02, 0.03], 0.5, 0.0, 0.0);
      }

      // 7. Ears (Pointed Triangular Cat Ears)
      const earTwitch = Math.sin(t * 4.0) * 0.03;

      // Left Ear Outer
      let earL = Mat4.create();
      earL = Mat4.translate(earL, [-0.78, 1.08, 0.1]);
      earL = Mat4.rotateZ(earL, 0.45 + earTwitch);
      earL = Mat4.rotateX(earL, -0.12);
      earL = Mat4.multiply(rootMat, earL);
      drawMesh(meshEarOuter, earL, colLimbs, 0.65, 0.0, 0.8);

      // Left Ear Inner Pink
      let earLin = Mat4.create();
      earLin = Mat4.translate(earLin, [-0.74, 1.08, 0.18]);
      earLin = Mat4.rotateZ(earLin, 0.45 + earTwitch);
      earLin = Mat4.rotateX(earLin, -0.12);
      earLin = Mat4.multiply(rootMat, earLin);
      drawMesh(meshEarInner, earLin, colMask, 0.75, 0.0, 0.4);

      // Right Ear Outer
      let earR = Mat4.create();
      earR = Mat4.translate(earR, [0.78, 1.08, 0.1]);
      earR = Mat4.rotateZ(earR, -0.45 - earTwitch);
      earR = Mat4.rotateX(earR, -0.12);
      earR = Mat4.multiply(rootMat, earR);
      drawMesh(meshEarOuter, earR, colLimbs, 0.65, 0.0, 0.8);

      // Right Ear Inner Pink
      let earRin = Mat4.create();
      earRin = Mat4.translate(earRin, [0.74, 1.08, 0.18]);
      earRin = Mat4.rotateZ(earRin, -0.45 - earTwitch);
      earRin = Mat4.rotateX(earRin, -0.12);
      earRin = Mat4.multiply(rootMat, earRin);
      drawMesh(meshEarInner, earRin, colMask, 0.75, 0.0, 0.4);



      // 8. Legs (Chubby Feet)
      let legL = Mat4.create();
      legL = Mat4.translate(legL, [-0.52, -1.24, 0.12]);
      legL = Mat4.scale(legL, [1.0, 0.75, 1.35]);
      legL = Mat4.multiply(rootMat, legL);
      drawMesh(meshLeg, legL, colLimbs, 0.65, 0.0, 0.8);

      let legR = Mat4.create();
      legR = Mat4.translate(legR, [0.52, -1.24, 0.12]);
      legR = Mat4.scale(legR, [1.0, 0.75, 1.35]);
      legR = Mat4.multiply(rootMat, legR);
      drawMesh(meshLeg, legR, colLimbs, 0.65, 0.0, 0.8);

      // 9. Arms & Pose Logic
      // Left Arm (Relaxed)
      let armL = Mat4.create();
      armL = Mat4.translate(armL, [-1.22, -0.22, 0.18]);
      armL = Mat4.scale(armL, [0.8, 1.4, 0.8]);
      armL = Mat4.rotateZ(armL, 0.45);
      armL = Mat4.multiply(rootMat, armL);
      drawMesh(meshArm, armL, colLimbs, 0.65, 0.0, 0.8);

      // Right Arm (Dynamic per pose)
      let armR = Mat4.create();

      if (pose === 0) {
        // Idle
        armR = Mat4.translate(armR, [1.22, -0.22, 0.18]);
        armR = Mat4.scale(armR, [0.8, 1.4, 0.8]);
        armR = Mat4.rotateZ(armR, -0.45);
        armR = Mat4.multiply(rootMat, armR);
        drawMesh(meshArm, armR, colLimbs, 0.65, 0.0, 0.8);
      } else if (pose === 1) {
        // Megaphone pose
        armR = Mat4.translate(armR, [0.82, -0.10, 0.65]);
        armR = Mat4.scale(armR, [0.8, 1.2, 0.8]);
        armR = Mat4.rotateZ(armR, -1.2);
        armR = Mat4.multiply(rootMat, armR);
        drawMesh(meshArm, armR, colLimbs, 0.65, 0.0, 0.8);

        // 3D Megaphone
        let hornMat = Mat4.create();
        hornMat = Mat4.translate(hornMat, [0.72, -0.05, 1.15]);
        hornMat = Mat4.rotateX(hornMat, 1.57);
        hornMat = Mat4.rotateZ(hornMat, 0.4);
        hornMat = Mat4.multiply(rootMat, hornMat);
        drawMesh(meshHorn, hornMat, [0.90, 0.18, 0.18], 0.35, 0.0, 0.0);

        let hornBase = Mat4.create();
        hornBase = Mat4.translate(hornBase, [0.55, -0.08, 0.85]);
        hornBase = Mat4.rotateX(hornBase, 1.57);
        hornBase = Mat4.rotateZ(hornBase, 0.4);
        hornBase = Mat4.multiply(rootMat, hornBase);
        drawMesh(meshHornBase, hornBase, colMask, 0.4, 0.0, 0.0);

        let handleMat = Mat4.create();
        handleMat = Mat4.translate(handleMat, [0.65, -0.32, 0.90]);
        handleMat = Mat4.multiply(rootMat, handleMat);
        drawMesh(meshHandle, handleMat, [0.10, 0.02, 0.03], 0.5, 0.0, 0.0);

      } else if (pose === 2) {
        // Wave pose
        const waveAngle = Math.sin(t * 10.0) * 0.35;
        armR = Mat4.translate(armR, [1.18, 0.45, 0.15]);
        armR = Mat4.scale(armR, [0.8, 1.3, 0.8]);
        armR = Mat4.rotateZ(armR, -2.1 + waveAngle);
        armR = Mat4.multiply(rootMat, armR);
        drawMesh(meshArm, armR, colLimbs, 0.65, 0.0, 0.8);
      }

      if (running) rafId = requestAnimationFrame(render);
    }
  rafId = requestAnimationFrame(render);

  return {
    setPose(p) { pose = p; },
    setMouth(m) { mouthStyle = m; },
    wave(ms = 1800) {
      const prev = pose;
      pose = 2;
      clearTimeout(tempPoseTimer);
      tempPoseTimer = setTimeout(() => { pose = prev === 2 ? 0 : prev; }, ms);
    },
    resize,
    setRunning(v) {
      if (v && !running) { running = true; rafId = requestAnimationFrame(render); }
      if (!v) { running = false; cancelAnimationFrame(rafId); }
    },
    dispose() {
      running = false;
      cancelAnimationFrame(rafId);
      clearTimeout(tempPoseTimer);
      window.removeEventListener('mousemove', onMove);
    },
  };
}
