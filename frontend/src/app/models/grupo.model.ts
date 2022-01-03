import { Usuario } from './usuario.model';
import { Curso } from './curso.model';

export class Grupo {
    constructor(
        public nombre: string,
        public proyecto: string,
        public proyectodes: string,
        public curso: Curso,
        public alumnos?: Usuario[],
        public uid?: string,
    )
    {}
}