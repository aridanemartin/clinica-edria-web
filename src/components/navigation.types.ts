export interface NavItem {
  path: string;
  label: string;
}

export interface AdminNavItem extends NavItem {
  icon?: string;
} 