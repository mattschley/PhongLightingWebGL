var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  //'uniform vec3 u_Kd;' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' + 
  
  //'varying vec4 v_Kd; \n' +
  'varying vec3 v_Normal;\n' +  
  'varying vec3 v_Position;\n' +
  
  'void main() {\n' +
  ' gl_Position = u_MvpMatrix * a_Position;\n' +
  ' v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  ' v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  //  '  v_Kd = vec4(u_Kd.rgb, 1.0); \n' +  // diffuse reflectance
  //' v_Kd = vec4(.5, 0.8, 0.2, 0.9); \n'  +
  '}\n';

var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_EyePos;\n' +
  'uniform vec3 u_Lamp0Pos;\n' +
  'uniform float u_Lamp0Amb;\n' + 
  'uniform float u_Lamp0Diff;\n' + 
  'uniform float u_Lamp0Spec;\n' +
  'uniform vec3 u_Lamp1Pos;\n' +
  'uniform float u_Lamp1Amb;\n' + 
  'uniform float u_Lamp1Diff;\n' + 
  'uniform float u_Lamp1Spec;\n' +
    'uniform vec3 u_Ke;\n' +              // Phong Reflectance: emissive
    'uniform vec3 u_Ka;\n' +              // Phong Reflectance: ambient
    'uniform vec3 u_Kd;\n' +              // Phong Reflectance: diffuse
    'uniform vec3 u_Ks;\n' +              // Phong Reflectance: specular
    'uniform float u_Kshiny;\n' +           // Phong Reflectance: 1 < shiny < 200 
  
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  //'varying vec4 v_Kd; \n' +
  
  'void main() {\n' +
    ' vec3 normal = normalize(v_Normal);\n' +
    ' vec3 eyeDir = normalize(u_EyePos - v_Position);\n' +
    //' vec3 lightDirection = normalize(u_Lamp0Pos - v_Position);\n' + original light direction
  ' vec3 lightDirection0 = normalize(u_Lamp0Pos - v_Position);\n' +
  ' vec3 lightDirection1 = normalize(u_Lamp1Pos - v_Position);\n' +
   //' float nDotL = max(dot(lightDirection, normal), 0.0);\n' + original ndotl
    ' float nDotL0 = max(dot(lightDirection0, normal), 0.0);\n' +
     ' float nDotL1 = max(dot(lightDirection1, normal), 0.0);\n' +
  ' vec3 emissive = u_Ke;\n' +
  ' vec3 r0 = reflect(lightDirection0,normal);\n' +
  ' vec3 r1 = reflect(lightDirection1,normal);\n' +
    ' float rDotE0 = max(0.0, dot(r0,eyeDir));\n' +
    ' float rDotE1 = max(0.0, dot(r1,eyeDir));\n' +
  ' vec3 ambient = (u_Lamp0Amb + u_Lamp1Amb) * u_Ka;\n' +
  //' vec3 diffuse = (u_Lamp0Diff * u_Lamp1Diff) * u_Kd * nDotL;\n' + original diffuse
  ' vec3 diffuse0 = (u_Lamp0Diff) * u_Kd * nDotL0;\n' +
  ' vec3 diffuse1 = (u_Lamp1Diff) * u_Kd * nDotL1;\n' +
  ' vec3 specular0 = u_Lamp0Spec * u_Ks * pow(rDotE0,u_Kshiny);\n' +
  ' vec3 specular1 = u_Lamp1Spec * u_Ks * pow(rDotE1,u_Kshiny);\n' +

//    ' vec3 ambient = u_Lamp0Amb * u_Lamp1Amb * v_Kd.rgb;\n' +
//    ' vec3 diffuse = u_Lamp0Diff * u_Lamp1Diff * v_Kd.rgb * nDotL;\n' +
   ' gl_FragColor = vec4(emissive + ambient + diffuse1 + diffuse0 + specular0+specular1, 1.0);\n' +
  //'  gl_FragColor = vec4(0.7, 0.3, 0.6, 1.0);\n' +
    '}\n';

var eyeX = 6.0, eyeY = 1.0 , eyeZ = 0;
var lapX = 0.0, lapY = 1.0, lapZ = 0.0;
var floatsPerVertex = 4;
var lamX = 0.0, lamY = 0.0, lamZ = 0.0;

var c30 = Math.sqrt(0.75);          // == cos(30deg) == sqrt(3) / 2
  var sq2 = Math.sqrt(2.0);
var verts = new Float32Array([
  
     0.0,  0.0, sq2,1.0,      
     c30, -0.5, 0.0,1.0,      
     0.0,  1.0, 0.0, 1.0,     
      // right side
     0.0,  0.0, sq2, 1.0,    
     0.0,  1.0, 0.0, 1.0,    
    -c30, -0.5, 0.0,1.0,     
      // lower side
     0.0,  0.0, sq2, 1.0,     
    -c30, -0.5, 0.0,1.0,      
     c30, -0.5, 0.0, 1.0,     
      // base side
    -c30, -0.5, 0.0,1.0,    
     0.0,  1.0, 0.0,1.0,  
     c30, -0.5, 0.0, 1.0,    



  -0.2-3,  0.0,  0.2, 1.0,
   0.2-3,  0.0,  0.2, 1.0,
  -0.2-3,  0.8,  0.2, 1.0,
     
   
   0.2-3,  0.0,  0.2, 1.0, 
   -0.2-3,  0.8,  0.2, 1.0,
   0.2-3,  0.8,  0.2, 1.0, 
  
  
   0.2-3,  0.0,  0.2, 1.0,
   0.2-3,  0.0, -0.2, 1.0,
   0.2-3,  0.8,  0.2, 1.0,
     0.2-3,  0.8,  0.2, 1.0,
   0.2-3,  0.0, -0.2, 1.0,
   0.2-3,  0.8, -0.2, 1.0,
  
   0.2-3,  0.0, -0.2, 1.0,
  -0.2-3,  0.0, -0.2, 1.0,
   0.2-3,  0.8, -0.2, 1.0,
    -0.2-3,  0.8, -0.2, 1.0,
    -0.2-3,  0.0, -0.2, 1.0,
   0.2-3,  0.8, -0.2, 1.0,
  
  -0.2-3,  0.0, -0.2, 1.0,
  -0.2-3,  0.0,  0.2, 1.0,
  -0.2-3,  0.8, -0.2, 1.0,
    -0.2-3,  0.8, -0.2, 1.0,
  -0.2-3,  0.0,  0.2, 1.0,
  -0.2-3,  0.8,  0.2, 1.0,
  
  -0.2-3,  0.8, -0.2, 1.0,
  -0.2-3,  0.8,  0.2, 1.0,
   0.2-3,  0.8, -0.2, 1.0,
    -0.2-3,  0.8,  0.2, 1.0,
   0.2-3,  0.8, -0.2, 1.0,
   0.2-3,  0.8,  0.2, 1.0,
  
  -0.2-3,  0.0, -0.2, 1.0,
  -0.2-3,  0.0,  0.2, 1.0,
   0.2-3,  0.0, -0.2, 1.0,
    -0.2-3,  0.0,  0.2, 1.0,
   0.2-3,  0.0, -0.2, 1.0,
   0.2-3,  0.0,  0.2, 1.0,

    1.0, -1.0, -3.0, 1.0, 
     1.0,  1.0, -3.0,    1.0,              
     1.0,  1.0,  -6.0,   1.0,               
     
     1.0,  1.0,  -6.0,    1.0,               
     1.0, -1.0,  -6.0,    1.0,               
     1.0, -1.0, -3.0,     1.0,               

    // +y face
    -1.0,  1.0, -3.0,     1.0,               
    -1.0,  1.0,  -6.0,     1.0, 
     1.0,  1.0,  -6.0,    1.0, 

     1.0,  1.0,  -6.0,    1.0, 
     1.0,  1.0, -3.0,     1.0,  
    -1.0,  1.0, -3.0,     1.0, 

    // +z face
    -1.0,  1.0,  -6.0,     1.0, 
    -1.0, -1.0,  -6.0,     1.0, 
     1.0, -1.0,  -6.0,     1.0, 

     1.0, -1.0,  -6.0,     1.0,               
     1.0,  1.0,  -6.0,    1.0,               
    -1.0,  1.0,  -6.0,    1.0,               

    // -x face
    -1.0, -1.0,  -6.0,    1.0,                
    -1.0,  1.0,  -6.0,     1.0,                
    -1.0,  1.0, -3.0,     1.0,               
    
    -1.0,  1.0, -3.0,    1.0,               
    -1.0, -1.0, -3.0,   1.0,                
    -1.0, -1.0,  -6.0,    1.0,                 
    
    // -y face
     1.0, -1.0, -3.0,     1.0,               
     1.0, -1.0,  -6.0,     1.0,               
    -1.0, -1.0,  -6.0,    1.0,               

    -1.0, -1.0,  -6.0,     1.0, 
    -1.0, -1.0, -3.0,    1.0,               
     1.0, -1.0, -3.0,     1.0,               

     // -z face
     1.0,  1.0, -3.0,     1.0,               
     1.0, -1.0, -3.0,    1.0,               
    -1.0, -1.0, -3.0,     1.0,                  

    -1.0, -1.0, -3.0,     1.0, 
    -1.0,  1.0, -3.0,    1.0,               
     1.0,  1.0, -3.0,     1.0, 
]);

var n_verts = 36;

function main() {

   var canvas = document.getElementById('webgl');
   winResize();
 
  var gl = getWebGLContext(canvas);

  console.log(gl);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
 
  console.log(gl);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
  }
  
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
      return -1;
  }

  var shape = initVertexBuffer(gl,verts,n_verts);

  makeGroundGrid();

  var ground = initVertexBuffer(gl,gndVerts,gndVerts.length)

  if (!initArrayBuffer(gl, 'a_Position',verts, gl.FLOAT, 4)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal',verts, gl.FLOAT, 4))  return -1;  
 //if (!initArrayBuffer(gl, 'a_Position',gndVerts, gl.FLOAT, 4)) return -1;
  //if (!initArrayBuffer(gl, 'a_Normal', gndVerts, gl.FLOAT,4))  return -1;  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  if (!ground || !shape){
    console.log('Failed to set the positions of the vertices')
    return;
  }

  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.enable(gl.DEPTH_TEST);
  
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program,'u_NormalMatrix');
  if (!u_ModelMatrix  || !u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get matrix storage locations');
      //return;
  }
  
  var u_Lamp0Pos  = gl.getUniformLocation(gl.program,   'u_Lamp0Pos');
  var u_Lamp0Amb  = gl.getUniformLocation(gl.program,   'u_Lamp0Amb');
  var u_Lamp0Diff = gl.getUniformLocation(gl.program,   'u_Lamp0Diff');
  var u_Lamp0Spec = gl.getUniformLocation(gl.program,   'u_Lamp0Spec');
  var u_Lamp1Pos  = gl.getUniformLocation(gl.program,   'u_Lamp1Pos');
  var u_Lamp1Amb  = gl.getUniformLocation(gl.program,   'u_Lamp1Amb');
  var u_Lamp1Diff = gl.getUniformLocation(gl.program,   'u_Lamp1Diff');
  var u_Lamp1Spec = gl.getUniformLocation(gl.program,   'u_Lamp1Spec');
  if( !u_Lamp0Pos || !u_Lamp0Amb || !u_Lamp0Diff || !u_Lamp0Spec) {//|| !u_Lamp0Diff  ) { // || !u_Lamp0Spec  ) {
    console.log('Failed to get the Lamp0 storage locations');
  //  return;
  }
  var u_Kd = gl.getUniformLocation(gl.program, 'u_Kd');
  var u_Ke = gl.getUniformLocation(gl.program, 'u_Ke');
  var u_Ka = gl.getUniformLocation(gl.program, 'u_Ka');
  var u_Ks = gl.getUniformLocation(gl.program, 'u_Ks');
  var u_Kshiny = gl.getUniformLocation(gl.program, 'u_Kshiny');
  if(!u_Kd) {
    console.log('Failed to get the Phong Reflectance storage locations');
  }
  // Position the first light source in World coords: 
  gl.uniform3f(u_Lamp0Pos, eyeX, eyeY, eyeZ);
  gl.uniform3f(u_Lamp1Pos, lamX, lamY, lamZ);
    // Set its light output:  
  gl.uniform1f(u_Lamp0Amb, 0.7);    // ambient
  gl.uniform1f(u_Lamp0Diff, 0.9);   // diffuse
  gl.uniform1f(u_Lamp0Spec, 0.9);   // Specular
  gl.uniform1f(u_Lamp1Amb, 0.7);    // ambient
  gl.uniform1f(u_Lamp1Diff, 0.5);   // diffuse
  gl.uniform1f(u_Lamp1Spec, 0.9);   // Specular

  //removed intital K value setting, now done later 
  /*gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);          // Kd diffuse
  gl.uniform3f(u_Ka, 0.24725, 0.2245, 0.0645);
  gl.uniform3f(u_Kd, 0.34615, 0.3143, 0.0903);
  gl.uniform3f(u_Ks, 0.797, 0.724, 0.208);
  gl.uniform1f(u_Kshiny, 82.3);*/

  var modelMatrix = new Matrix4();  
  var mvpMatrix = new Matrix4();   
  var normalMatrix = new Matrix4(); 
  
  mvpMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt( eyeX, eyeY, eyeZ,        // eye
              lapX, lapY, lapZ,        // aim-point
          0, 0.1, 0);       // up.
            
  mvpMatrix.multiply(modelMatrix);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   tick = function() {
    document.onkeydown = function(ev,gl, a_Position, shape, ground, modelMatrix, u_ModelMatrix, mvpMatrix, u_MvpMatrix, normalMatrix, u_NormalMatrix){keydown(ev);};
  gl.uniform3f(u_Lamp0Pos, eyeX, eyeY, eyeZ); 
  gl.uniform3f(u_Lamp1Pos, lamX, lamY, lamZ);

  mvpMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt( eyeX, eyeY, eyeZ,        // eye
              lapX, lapY, lapZ,        // aim-point
            0, 0.1, 0);       // up.

  console.log(eyeX); 
  console.log(eyeY);
  console.log(eyeZ);


  draw(gl, a_Position, shape, ground, modelMatrix, u_ModelMatrix, mvpMatrix, u_MvpMatrix, normalMatrix, u_NormalMatrix,u_Ka, u_Ke, u_Kd, u_Ks, u_Kshiny);
  requestAnimationFrame(tick, canvas);

  };
  
  tick();
}

function makeGroundGrid() {
  var xcount = 100;      
  var ycount = 100;    
  var xymax = 50.0;     
 
  gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
  
  var xgap = xymax/(xcount-1);  
  var ygap = xymax/(ycount-1);
  
  for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
    if(v%2==0) {  
      gndVerts[j  ] = -xymax + (v  )*xgap;  
      gndVerts[j+1] = -xymax;               
      gndVerts[j+2] = 0.0;                  
    }
    else {        
      gndVerts[j  ] = -xymax + (v-1)*xgap;
      gndVerts[j+1] = xymax;                
      gndVerts[j+2] = 0.0;              
    }
    gndVerts[j+3] = 1.0;          
  }

  for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
    if(v%2==0) {  
      gndVerts[j  ] = -xymax;               
      gndVerts[j+1] = -xymax + (v  )*ygap;
      gndVerts[j+2] = 0.0;                  
    }
    else {        
      gndVerts[j  ] = xymax;              
      gndVerts[j+1] = -xymax + (v-1)*ygap;
      gndVerts[j+2] = 0.0;                
    }
    gndVerts[j+3] = 1.0;          
  }
  
}

function initVertexBuffer(gl, data, num, type) {
  //if (!initArrayBuffer(gl, 'a_Position',shape, gl.FLOAT, 3)) return -1;
  //if (!initArrayBuffer(gl, 'a_Normal',shape, gl.FLOAT, 3))  return -1;
  // if (!initArrayBuffer(gl, 'a_Position', n_verts, 3)) return -1;
  //if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  //if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  buffer.num = num;
  buffer.type = type;

  return buffer;
    
}

function initArrayBuffer(gl, attribute, data, type, num) {

  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  
  if (a_attribute < 0) {
  console.log('Failed to get the storage location of ' + attribute);
  return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  
  gl.enableVertexAttribArray(a_attribute);
  
 /* var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, num, type, false, 0, 0);
  
    gl.enableVertexAttribArray(a_Position);
  */
    return true;
}

function keydown(ev,gl, a_Position, shape, ground, modelMatrix, u_ModelMatrix, mvpMatrix, u_MvpMatrix, normalMatrix, u_NormalMatrix,canvas) {

    switch (ev.keyCode) {
      // camera coords
        case 39: //+x 
        eyeZ -= 0.1;
        console.log('Right arrow pressed');
        console.log(eyeX);  
              break;
        case 37://-x
        eyeZ += 0.1;
        console.log('Left arrow pressed');  
            break;  
        case 38://-x
        eyeX -= 0.1;
        
            break;
        case 40://+x
        eyeX += 0.1;
        
            break;
        case 84://-z
        eyeY += 0.1;

            break;
        case 89://-z
        eyeY -= 0.1;
            break;
        case 85://-z
        lapY += 0.1;
            break;
        case 68://-z
        lapY -= 0.1;
            break;
        case 76://-z
        lapZ += 0.1;
            break;
        case 82://-z
        lapZ -= 0.1;
            break;
        case 65://-z
        lamZ += 1.0;
            break;
        case 83://-z
        lamZ -= 1.0;
            break;
        case 87://camera -x directio
        lamX -= 0.5;
            break;
        case 88://camera -x directio
        lamX += 0.5;
            break;
        case 49://camera -x directio
        lamY += 0.5;
            break;
        case 50://camera -x directio
        lamY -= 0.5;
            break;
        case 112:
            document.getElementById("help_message").innerHTML = "help";
            break;
          default:
            return;
    }
//tick();

}


function draw(gl, a_Position, shape, ground, modelMatrix, u_ModelMatrix, mvpMatrix, u_MvpMatrix, normalMatrix, u_NormalMatrix,u_Ka, u_Ke, u_Kd, u_Ks, u_Kshiny){
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  pushMatrix(mvpMatrix);
  
  mvpMatrix.rotate(-90.0, 1,0,0);
  
  mvpMatrix.translate(0.0, 0.0, -1.0);  
  
  mvpMatrix.scale(0.4, 0.4,0.4);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, ground);
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
  gl.drawArrays(gl.LINES, 0, gndVerts.length/floatsPerVertex);
  
  mvpMatrix = popMatrix();

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, shape);
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);          // Kd diffuse
  gl.uniform3f(u_Ka, 0.24725, 0.2245, 0.0645);
  gl.uniform3f(u_Kd, 0.34615, 0.3143, 0.0903);
  gl.uniform3f(u_Ks, 0.797, 0.724, 0.208);
  gl.uniform1f(u_Kshiny, 82.3 ); //82.3
  gl.drawArrays(gl.TRIANGLES, 0,12); //n_verts for all 



  gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);          // Kd diffuse
  gl.uniform3f(u_Ka, 0.17, 0.01175, 0.01175);
  gl.uniform3f(u_Kd, 0.61424, 0.041, 0.041);
  gl.uniform3f(u_Ks, 0.728, 0.627, 0.627);
  gl.uniform1f(u_Kshiny, 76.8);

  gl.drawArrays(gl.TRIANGLES, 12, 36);

  gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);          // Kd diffuse
  gl.uniform3f(u_Ka, 0.25, 0.25, 0.25);
  gl.uniform3f(u_Kd, 0.7, 0.4, 0.4);
  gl.uniform3f(u_Ks, 0.774597, 0.774597, 0.774597);
  gl.uniform1f(u_Kshiny, 76.8);
  gl.drawArrays(gl.TRIANGLES, 36, 42);

  //if (!initArrayBuffer(gl, 'a_Position',gndVerts, gl.FLOAT, 4)) return -1;
  //if (!initArrayBuffer(gl, 'a_Normal', gndVerts, gl.FLOAT,4))  return -1; 
  
}

function winResize() {
//==============================================================================
// Called when user re-sizes their browser window , because our HTML file
// contains:  <body onload="main()" onresize="winResize()">

  var nuCanvas = document.getElementById('webgl');  // get current canvas
  var nuGL = getWebGLContext(nuCanvas);             // and context:
/*
  //Report our current browser-window contents:

  console.log('nuCanvas width,height=', nuCanvas.width, nuCanvas.height);   
 console.log('Browser window: innerWidth,innerHeight=', 
                                innerWidth, innerHeight); // http://www.w3schools.com/jsref/obj_window.asp
*/
  
  //Make canvas fill the top 3/4 of our browser window:
  nuGL.canvas.width = innerWidth;
  nuGL.canvas.height = innerHeight*3/4;
  //IMPORTANT!  need to re-draw screen contents
  nuGL.viewport(0, 0, nuGL.canvas.width, nuGL.canvas.height);
  return nuGL;
     
}
function directions() {

  alert("These are your directions!\n\nUse up and down arrow to go forward and backwards.\n\nUse right and left arrow to move right and left\n\nUse u to look up and d to look down\n\nUse r and l to look right and left.\n\nUse t to fly up and y to dive down.\n\nUse w to move lamp forward, x to move lamp back!\n\nUse a to move lamp left, s to move lamp right\n\nUse 1 to move lamp up, 2 to move lamp down!\n\n");}