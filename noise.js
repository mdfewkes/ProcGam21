/* CC0 */
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const G3 = (1.0 / 6.0);
const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
function makeNoise2D() {
    const grad = [
        [ 1, 1],
        [-1, 1],
        [ 1,-1],
        [-1,-1],
        [ 1, 0],
        [-1, 0],
        [ 1, 0],
        [-1, 0],
        [ 0, 1],
        [ 0,-1],
        [ 0, 1],
        [ 0,-1],
    ];
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y) => {
        const s = (x + y) * 0.5 * (Math.sqrt(3.0) - 1.0);
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        const g0 = grad[permMod12[ii + perm[jj]]];
        const g1 = grad[permMod12[ii + i1 + perm[jj + j1]]];
        const g2 = grad[permMod12[ii + 1 + perm[jj + 1]]];
        const t0 = 0.5 - x0 * x0 - y0 * y0;
        const n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0);
        const t1 = 0.5 - x1 * x1 - y1 * y1;
        const n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1);
        const t2 = 0.5 - x2 * x2 - y2 * y2;
        const n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2);
        return 70.14805770653952 * (n0 + n1 + n2);
    };
}
function makeNoise3D() {
    const grad = [
        [ 1, 1, 0],
        [-1, 1, 0],
        [ 1,-1, 0],
        [-1,-1, 0],
        [ 1, 0, 1],
        [-1, 0, 1],
        [ 1, 0,-1],
        [-1, 0,-1],
        [ 0, 1, 1],
        [ 0,-1,-1],
        [ 0, 1,-1],
        [ 0,-1,-1],
    ];
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y, z) => {
        const s = (x + y + z) / 3.0;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = i2 = j2 = 1;
                j1 = k1 = k2 = 0;
            } else if (x0 >= z0) {
                i1 = i2 = k2 = 1;
                j1 = k1 = j2 = 0;
            } else {
                k1 = i2 = k2 = 1;
                i1 = j1 = j2 = 0;
            }
        } else {
            if (y0 < z0) {
                k1 = j2 = k2 = 1;
                i1 = j1 = i2 = 0;
            } else if (x0 < z0) {
                j1 = j2 = k2 = 1;
                i1 = k1 = i2 = 0;
            } else {
                j1 = i2 = j2 = 1;
                i1 = k1 = k2 = 0;
            }
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const g0 = grad[permMod12[ii + perm[jj + perm[kk]]]];
        const g1 = grad[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]];
        const g2 = grad[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]];
        const g3 = grad[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]];
        const t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
        const n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0 + g0[2] * z0);
        const t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
        const n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1 + g1[2] * z1);
        const t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
        const n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2 + g2[2] * z2);
        const t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
        const n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * (g3[0] * x3 + g3[1] * y3 + g3[2] * z3);
        return 94.68493150681972 * (n0 + n1 + n2 + n3);
    };
}
function makeNoise4D() {
    const grad = [
        [ 0, 1, 1, 1],
        [ 0, 1, 1,-1],
        [ 0, 1,-1, 1],
        [ 0, 1,-1,-1],
        [ 0,-1, 1, 1],
        [ 0,-1, 1,-1],
        [ 0,-1,-1, 1],
        [ 0,-1,-1,-1],
        [ 1, 0, 1, 1],
        [ 1, 0, 1,-1],
        [ 1, 0,-1, 1],
        [ 1, 0,-1,-1],
        [-1, 0, 1, 1],
        [-1, 0, 1,-1],
        [-1, 0,-1, 1],
        [-1, 0,-1,-1],
        [ 1, 1, 0, 1],
        [ 1, 1, 0,-1],
        [ 1,-1, 0, 1],
        [ 1,-1, 0,-1],
        [-1, 1, 0, 1],
        [-1, 1, 0,-1],
        [-1,-1, 0, 1],
        [-1,-1, 0,-1],
        [ 1, 1, 1, 0],
        [ 1, 1,-1, 0],
        [ 1,-1, 1, 0],
        [ 1,-1,-1, 0],
        [-1, 1, 1, 0],
        [-1, 1,-1, 0],
        [-1,-1, 1, 0],
        [-1,-1,-1, 0],
    ];
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y, z, w) => {
        const s = (x + y + z + w) * (Math.sqrt(5.0) - 1.0) / 4.0;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const l = Math.floor(w + s);
        const t = (i + j + k + l) * G4;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        let rankx = 0;
        let ranky = 0;
        let rankz = 0;
        let rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        const i1 = rankx >= 3 ? 1 : 0;
        const j1 = ranky >= 3 ? 1 : 0;
        const k1 = rankz >= 3 ? 1 : 0;
        const l1 = rankw >= 3 ? 1 : 0;
        const i2 = rankx >= 2 ? 1 : 0;
        const j2 = ranky >= 2 ? 1 : 0;
        const k2 = rankz >= 2 ? 1 : 0;
        const l2 = rankw >= 2 ? 1 : 0;
        const i3 = rankx >= 1 ? 1 : 0;
        const j3 = ranky >= 1 ? 1 : 0;
        const k3 = rankz >= 1 ? 1 : 0;
        const l3 = rankw >= 1 ? 1 : 0;
        const x1 = x0 - i1 + G4;
        const y1 = y0 - j1 + G4;
        const z1 = z0 - k1 + G4;
        const w1 = w0 - l1 + G4;
        const x2 = x0 - i2 + 2.0 * G4;
        const y2 = y0 - j2 + 2.0 * G4;
        const z2 = z0 - k2 + 2.0 * G4;
        const w2 = w0 - l2 + 2.0 * G4;
        const x3 = x0 - i3 + 3.0 * G4;
        const y3 = y0 - j3 + 3.0 * G4;
        const z3 = z0 - k3 + 3.0 * G4;
        const w3 = w0 - l3 + 3.0 * G4;
        const x4 = x0 - 1.0 + 4.0 * G4;
        const y4 = y0 - 1.0 + 4.0 * G4;
        const z4 = z0 - 1.0 + 4.0 * G4;
        const w4 = w0 - 1.0 + 4.0 * G4;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const ll = l & 255;
        const g0 = grad[perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32];
        const g1 = grad[perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32];
        const g2 = grad[perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32];
        const g3 = grad[perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32];
        const g4 = grad[perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32];
        const t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        const n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0 + g0[2] * z0 + g0[3] * w0);
        const t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        const n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1 + g1[2] * z1 + g1[3] * w1);
        const t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        const n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2 + g2[2] * z2 + g2[3] * w2);
        const t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        const n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * (g3[0] * x3 + g3[1] * y3 + g3[2] * z3 + g3[3] * w3);
        const t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        const n4 = t4 < 0 ? 0.0 : Math.pow(t4, 4) * (g4[0] * x4 + g4[1] * y4 + g4[2] * z4 + g4[3] * w4);
        return 72.37855765153665 * (n0 + n1 + n2 + n3 + n4);
    };
}
let simplex2D = makeNoise2D();
let simplex3D = makeNoise3D();
let simplex4D = makeNoise4D();

const looplex2D = (x, y, fx = 0.1, fy = 0.1, octaves = [[2,0.5],[2,0.5]]) => {
    let amplitude = 1;
    let range = 1;
    let v = simplex2D( x * fx, y * fy );
    octaves.forEach(octave => {
        fx *= octave[0];
        fy *= octave[0];
        amplitude *= octave[1];
        range += amplitude;
        v += simplex2D( x * fx, y * fy ) * amplitude;
    });
    return ((v / range) + 1) / 2;
}
const looplex3D = (x, y, z, fx, fy, fz, octaves = [[2,0.5],[2,0.5]]) => {
    let amplitude = 1;
    let range = 1;
    let v = simplex3D( x * fx, y * fy, z * fz );
    octaves.forEach(octave => {
        fx *= octave[0];
        fy *= octave[0];
        fz *= octave[0];
        amplitude *= octave[1];
        range += amplitude;
        v += simplex3D( x * fx, y * fy, z * fz ) * amplitude;
    });
    return ((v / range) + 1) / 2;
}
const looplex4D = (x, y, z, u, fx, fy, fz, fu, octaves = [[2,0.5],[2,0.5]]) => {
    let amplitude = 1;
    let range = 1;
    let v = simplex4D( x * fx, y * fy, z * fz, u * fu );
    octaves.forEach(octave => {
        fx *= octave[0];
        fy *= octave[0];
        fz *= octave[0];
        fu *= octave[0];
        amplitude *= octave[1];
        range += amplitude;
        v += simplex4D( x * fx, y * fy, z * fz, u * fu ) * amplitude;
    });
    return ((v / range) + 1) / 2;
}
function binaryString(len = 16, xo = 0, yo = 0, threshold = 0.5, fx = 0.1, fy = 0.1, octaves = [[2,0.5],[2,0.5]]) {
    let str = "";
    for(let i = 0; i < len;i++) {
        const v = looplex2D(i+xo, 0+yo, fx, fy, octaves);
        str += v > threshold ? "1" : "0";
    }
    return str;
}
function binaryStringQuad(len = 16, xo = 0, yo = 0, threshold = 0.5, fx = 0.1, fy = 0.1, octaves = [[2,0.5],[2,0.5]]) {
    const str = binaryString(len/4, xo, yo, threshold, fx, fy, octaves);
    const str2 = binaryString(len/4, xo, yo+1, threshold, fx, fy, octaves);
    
    return str + str + str2 + str2;
}
function randBinaryStringQuad(seed, len = 16, xo = 0, yo = 0, threshold = 0.5, fx = 0.1, fy = 0.1, octaves = [[2,0.5],[2,0.5]]) {

    if(seed)Math.seedrandom(seed);

    simplex2D = makeNoise2D();

    return binaryStringQuad(len, xo, yo, threshold, fx, fy, octaves);
}