// POLYGON/POINT

export function pointInPolygon(vertices: Array<Array<number>>, px: number, py: number) {
    let collision = false;
  
    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) {
        next = 0;
      }
        
      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      const vc = vertices[current];    // c for "current"
      const vn = vertices[next];       // n for "next"
  
      // compare position, flip 'collision' variable
      // back and forth
      if (((vc[1] >= py && vn[1] < py) || (vc[1] < py && vn[1] >= py)) &&
           (px < (vn[0] - vc[0]) * (py - vc[1]) / (vn[1] - vc[1]) + vc[0])) {
              collision = !collision;
      }
    }
    return collision;
  }