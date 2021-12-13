const INSTRUMENT_ARR = [
    /* 0 */{name:"DRUM - LOW BEAT",         zzfx:[      0,      0,    100,  0.003,      0,  0.008,      0,   0.97,    -35,     53,      0,      0,      0,      0,      0,    0.1,      0,      0,      0,      0]},
    /* 1 */{name:"DRUM - BASS",             zzfx:[    1.4,      0,    100,      0,      0,      0,      0,    0.7,      0,      0,      0,    0.5,      0,    6.7,      1,   0.01,      0,      0,      0,      0]},
    /* 2 */{name:"DRUM - SOFT BASS",        zzfx:[      0,      0,    100,      0,      0,      0,      0,    0.7,      0,      0,      0,    0.5,      0,    6.7,      1,   0.05,      0,      0,      0,      0]},
    /* 3 */{name:"DRUM - SNARE",            zzfx:[      2,      0,    100,      0,      0,   0.12,      2,      2,      0,      0,      0,      0,      0,      9,      0,    0.1,      0,      0,      0,      0]},
    /* 4 */{name:"DRUM - TOM",              zzfx:[    1.8,      0,    100,      0,      0,    0.2,      0,      4,     -2,      6,     50,   0.15,      0,      6,      0,      0,      0,      0,      0,      0]},
    /* 5 */{name:"DRUM - SOFT SNARE 1",     zzfx:[    0.4,      0,    1000,      0,      0,      0,      0,      0,      0,      0,      0,      0,   0.01,    6.8,   -0.2,      0,      0,      0,      0,      0]},
    /* 6 */{name:"DRUM - SOFT SNARE 2",     zzfx:[      2,      0,    100,      0,      0,   0.03,      2,   1.25,      0,      0,      0,      0,   0.02,    6.8,   -0.3,      0,    0.5,      0,      0,      0]},
    /* 7 */{name:"DRUM - SOFT SNARE 3",     zzfx:[      0,      0,    100,      0,      0,   0.09,      3,   1.65,      0,      0,      0,      0,   0.02,    3.8,   -0.1,      0,    0.2,      0,      0,      0]},
    /* 8 */{name:"DRUM - SOFT SNARE 4",     zzfx:[      0,      0,    100,      0,      0,   0.09,      3,   1.65,      0,      0,      0,      0,   0.02,    3.8,   -0.1,      0,    0.2,      0,      0,      0]},
    /* 9 */{name:"SYNTH - LOW BASS",        zzfx:[      0,      0,    100,      0,   0.07,   0.07,      2,      0,      0,      0,    0.5,   0.01,      0,      0,      0,      0,      0,      0,      0,      0]},
    /* 10 */{name:"SYNTH - BASS",           zzfx:[      0,      0,    100,      0,    0.1,      0,      2,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0]},
    /* 11 */{name:"SYNTH - BASS GUITAR",    zzfx:[    1.2,      0,    100,      0,      0,    0.2,      3,      4,      0,      0,      3,    0.9,   0.05,      0,      0,      0,      0,      0,      0,      0]},
    /* 12 */{name:"SYNTH - WOOSH",          zzfx:[    0.8,      0,    100,      0,      0,   0.12,      3,   1.65,     -2,      0,      0,      0,      0,    4.5,      0,   0.02,      0,      0,      0,      0]},
    /* 13 */{name:"SYNTH - SOFT BLOOP",     zzfx:[    1.2,      0,    100,      0,   0.25,   0.45,      0,      0,      0,      0,      0,      0,    0.2,      0,      0,      0,      0,      0,      0,    0.1]},
    /* 14 */{name:"SYNTH - LASER 1",        zzfx:[      2,      0,    100,      0,      0,  0.375,      2,    3.5,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0]},
    /* 15 */{name:"SYNTH - FLUTE 1",        zzfx:[      2,      0,    100,   0.01,    0.2,   0.48,      0,     44,      0,      0,    200,      0,      0,    0.1,      0,      0,      0,      0,      0,      0]},
    /* 16 */{name:"SYNTH - FLUTE 2",        zzfx:[      2,      0,    100,      0,   0.02,    0.2,      0,     44,      0,      0,    200,      0,      0,    0.1,      0,      0,      0,      0,      0,      0]},
    /* 17 */{name:"SYNTH - LASER 3",        zzfx:[      0,      0,    100,      0,   0.02,   0.25,      3,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0]},
    /* 18 */{name:"SYNTH - BUZZ CHIME",     zzfx:[    1.5,      0,    100,      0,      0,   0.15,      2,    0.2,   -0.1,  -0.15,      9,   0.02,      0,    0.1,   0.12,      0,   0.06,      0,      0,      0]},
    /* 19 */{name:"SYNTH - DIRTY SQUARE",   zzfx:[      0,      0,    100,   0.01,      0,    0.3,      2,      0,      0,      0,      0,      0,      0,      0,      0,   0.02,   0.01,      0,      0,      0]},
    /* 20 */{name:"SYNTH - BUMBLE BEE",     zzfx:[   0.75,      0,    100,      0,      0,   0.25,      6,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0]}
    ];

var str = `const INSTRUMENT_ARR = [\n`;
var arr = [];
INSTRUMENT_ARR.forEach((n,i)=>{
    const prefix = `/* ${i} */{name:"${n.name}",`.padEnd(40," ");
    const asdf2 = n.zzfx.map(n2=>{
        console.log('n2 === ',n2);
        return n2;
    });
    const asdf3 = [
        ...asdf2,
        ...Array(20-asdf2.length).fill(0)
    ].map(n2=>{
        let _str = (n2+"" ?? "0").padStart(7," ");
        return _str;
    });
    const suffix = `zzfx:[${asdf3}]}`;

    arr.push(`${prefix}${suffix}`);
});
str += arr.join(",\n") + `\n];`;
console.log('str === ',str);