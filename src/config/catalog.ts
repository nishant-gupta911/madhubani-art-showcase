export interface CategoryDefinition {
  id: string;
  name: string;
  short: string;
  icon: string;
  count?: number;
}

export const CATALOG_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'paintings',
    name: 'Madhubani Paintings (Framed)',
    short: 'Paintings',
    icon: 'Frame',
    count: 27,
  },
  {
    id: 'dupattas',
    name: 'Dupattas & Angvastras',
    short: 'Dupattas',
    icon: 'Sparkles',
    count: 27,
  },
  {
    id: 'bags_and_files',
    name: 'Bags, Purses & Files',
    short: 'Bags & Files',
    icon: 'Briefcase',
    count: 12,
  },
];

export const CATALOG_STYLES = [
  'Bharni',
  'Kachni',
  'Tantrik',
  'Godna',
  'Kohbar',
] as const;

export type CatalogStyle = (typeof CATALOG_STYLES)[number];
