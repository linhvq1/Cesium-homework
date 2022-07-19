export function getPointFromLine(l){
  let lol = []
  lines.filter(line => line.id === l)[0].path.replaceAll(' ','').split(',').map(p => points.filter(point=> point.id === p)[0].data.replaceAll(' ','').split(',').map(pp=>lol.push(parseFloat(pp))))
  return lol
}

export function getPointFromFace(f){
    let lol = []
    faces.filter(face => face.id === f)[0].path.replaceAll(' ','').split(',')
    .map(l=>lol.push(getPointFromLine(l)))
    return lol.join().split(',').map(p=>parseFloat(p))
  }

export function floatBuilderFromPoint(...args) {
    let lol = [];
    for (let el of args) {
      el.split(",").map((i) => lol.push(parseFloat(i)));
    }
    return lol;
  }
  
export function CreateLines() {
    let lol = [];
    for (let el of lines) {
      el.path
        .replaceAll(" ", "")
        .split(",")
        .map((i) => lol.push(i));
    }
    let meo = [];
    for (let el of lol) {
      points
        .filter((i) => i.id === el)[0]
        .data.split(",")
        .map((em) => meo.push(parseFloat(em)));
    }
    return meo;
  }
  
  // 1 line thi co 2 point
  // tim duoc 1 line roi add point vo mang tam
  // lay ket qua tu mang tam de push vao mang chinh
  
export function createFace() {
    let lol = [];
    for (let el of faces) {
        el.path
          .replaceAll(" ", "")
          .split(",")
          .map((i) =>
            lines
              .filter((l) => l.id === i)[0]
              .path.replaceAll(" ", "")
              .split(",")
              .map((p) =>
                points
                  .filter((ii) => ii.id === p)[0]
                  .data.replaceAll(" ", "")
                  .split(",").map(pp=>lol.push(parseFloat(pp)))
              )
          )
    }
    return lol
}

export const points = [
  {
    data: "-93.62033081054688, 42.01864242553711, 278.75982666015625",
    id: "C0",
  },
  { data: "-93.6204605102539, 42.01866912841797, 278.259521484375", id: "C1" },
  {
    data: "-93.62049102783203, 42.018638610839844, 279.4393310546875",
    id: "C2",
  },
  { data: "-93.6205062866211, 42.0186767578125, 278.1129150390625", id: "C3" },
  {
    data: "-93.62063598632812, 42.01869583129883, 277.5174865722656",
    id: "C4",
  },
  {
    data: "-93.62065887451172, 42.01863098144531, 280.3157958984375",
    id: "C5",
  },
  { data: "-93.62035369873047, 42.01857376098633, 281.31640625", id: "C6" },
  { data: "-93.62035369873047, 42.01857376098633, 281.31640625", id: "C7" },
  {
    data: "-93.62065887451172, 42.01863098144531, 280.3157958984375",
    id: "C8",
  },
  {
    data: "-93.62068176269531, 42.01856231689453, 277.7317810058594",
    id: "C9",
  },
  {
    data: "-93.62055206298828, 42.01853561401367, 278.13677978515625",
    id: "C10",
  },
  {
    data: "-93.62052154541016, 42.01856231689453, 279.42364501953125",
    id: "C11",
  },
  { data: "-93.6205062866211, 42.01852798461914, 278.27490234375", id: "C12" },
  { data: "-93.62037658691406, 42.01850509643555, 278.7041015625", id: "C13" },
  {
    data: "-93.62023162841797, 42.01863479614258, 272.98077392578125",
    id: "C14",
  },
  {
    data: "-93.62026977539062, 42.01851272583008, 273.00872802734375",
    id: "C15",
  },
  {
    data: "-93.62031555175781, 42.01852035522461, 274.04339599609375",
    id: "C16",
  },
  {
    data: "-93.62027740478516, 42.01864242553711, 274.04608154296875",
    id: "C17",
  },
  {
    data: "-93.62027740478516, 42.01864242553711, 274.04608154296875",
    id: "C18",
  },
  {
    data: "-93.62031555175781, 42.01852035522461, 274.04339599609375",
    id: "C19",
  },
  {
    data: "-93.62035369873047, 42.01852798461914, 272.7657165527344",
    id: "C20",
  },
  {
    data: "-93.62031555175781, 42.01865005493164, 272.7519836425781",
    id: "C21",
  },
  {
    data: "-93.62052154541016, 42.01856231689453, 279.42364501953125",
    id: "C22",
  },
  {
    data: "-93.62055206298828, 42.01853561401367, 278.13677978515625",
    id: "C23",
  },
  {
    data: "-93.62052917480469, 42.01852798461914, 279.4580993652344",
    id: "C24",
  },
  {
    data: "-93.6204833984375, 42.018672943115234, 279.4894104003906",
    id: "C25",
  },
  {
    data: "-93.62049102783203, 42.018638610839844, 279.4393310546875",
    id: "C26",
  },
  { data: "-93.6205062866211, 42.0186767578125, 278.1129150390625", id: "C27" },
  { data: "-93.6204605102539, 42.01866912841797, 278.259521484375", id: "C28" },
  {
    data: "-93.6204833984375, 42.018672943115234, 279.4894104003906",
    id: "C29",
  },
  {
    data: "-93.62049102783203, 42.018638610839844, 279.4393310546875",
    id: "C30",
  },
  {
    data: "-93.62052154541016, 42.01856231689453, 279.42364501953125",
    id: "C31",
  },
  {
    data: "-93.62052917480469, 42.01852798461914, 279.4580993652344",
    id: "C32",
  },
  { data: "-93.6205062866211, 42.01852798461914, 278.27490234375", id: "C33" },
];

export const lines = [
  { id: "L0", path: "C0, C1" },
  { id: "L1", path: "C1, C2" },
  { id: "L2", path: "C2, C3" },
  { id: "L3", path: "C3, C4" },
  { id: "L4", path: "C4, C5" },
  { id: "L5", path: "C5, C6" },
  { id: "L6", path: "C6, C0" },
  { id: "L7", path: "C7, C8" },
  { id: "L8", path: "C8, C9" },
  { id: "L9", path: "C9, C10" },
  { id: "L10", path: "C10, C11" },
  { id: "L11", path: "C11, C12" },
  { id: "L12", path: "C12, C13" },
  { id: "L13", path: "C13, C7" },
  { id: "L14", path: "C14, C15" },
  { id: "L15", path: "C15, C16" },
  { id: "L16", path: "C16, C17" },
  { id: "L17", path: "C17, C14" },
  { id: "L18", path: "C18, C19" },
  { id: "L19", path: "C19, C20" },
  { id: "L20", path: "C20, C21" },
  { id: "L21", path: "C21, C18" },
  { id: "L22", path: "C22, C23" },
  { id: "L23", path: "C23, C24" },
  { id: "L24", path: "C24, C22" },
  { id: "L25", path: "C25, C26" },
  { id: "L26", path: "C26, C27" },
  { id: "L27", path: "C27, C25" },
  { id: "L28", path: "C28, C29" },
  { id: "L29", path: "C29, C30" },
  { id: "L30", path: "C30, C28" },
  { id: "L31", path: "C31, C32" },
  { id: "L32", path: "C32, C33" },
  { id: "L33", path: "C33, C31" },
];

export const faces = [
  { id: "P0", path: "L0, L1, L2, L3, L4, L5, L6" },

  { id: "P1", path: "L7, L8, L9, L10, L11, L12, L13" },

  { id: "P2", path: "L14, L15, L16, L17" },

  { id: "P3", path: "L18, L19, L20, L21" },

  { id: "P4", path: "L22, L23, L24" },

  { id: "P5", path: "L25, L26, L27" },

  { id: "P6", path: "L28, L29, L30" },

  { id: "P7", path: "L31, L32, L33" },
];
