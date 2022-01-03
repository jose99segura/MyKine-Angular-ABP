import { Usuario } from './usuario.model';
import { Curso } from './curso.model';

export class Asignatura {
    constructor(
        public nombre: string,
        public nombrecorto: string,
        public curso: Curso,
        public profesores?: Usuario[],
        public alumnos?: Usuario[],
        public uid?: string,
        public items?: number,
    )
    {}
}
