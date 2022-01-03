
interface sidebarSubItem {
    titulo: string;
    icono: string;
    url: string;
}

export interface sidebarItem {
    titulo: string;
    icono: string;
    sub: boolean;
    url?: string;
    subMenu?: sidebarSubItem[];
}