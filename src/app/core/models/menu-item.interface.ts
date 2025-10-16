export interface MenuItem {
     label: string;
     icon?: string;
     route?: string;
     submenus?: MenuItem[];
     isHeader?: boolean;

}
