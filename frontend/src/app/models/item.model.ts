
export class Item {

    constructor(
        public nombre: string,
        public descripcion: string,
        public tipo: string,
        public valor?: number,
        public horasEstimadas?: number,
        public horasAbsolutas?: number,
        public asignatura?: string,
        public uid?: string,
        public orden?: number,
    )
    {}
}