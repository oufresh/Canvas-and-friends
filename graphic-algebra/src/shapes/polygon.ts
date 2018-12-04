export class Polygon {

    vertices: Array<Array<number>>;

    constructor(vertices?: Array<Array<number>>) {
        if (vertices) {
            this.vertices = vertices;
        } else {
            this.vertices = [];
        }
    }

    pushVertex = (v: Array<number>): void => {
        this.vertices.push(v);
    }
}