import { expect } from "@playwright/test";

export type SortOption = 'Name A-Z' | 'Name Z-A' | 'Price H-L' | 'Price L-H' | 'Co2 A-E' | 'Co2 E-A';


export type FilterCategory = 
  'HAND TOOLS' | 
  'HAMMEER' | 
  'HAND SAW' | 
  'WRENCH' |
  'SCREWDRIVER' |
  'Pliers' |
  'Chisels' |
  'Measures' |
  'Power Tools' |
  'Grinder' |
  'Sander' |
  'Saw' |
  'Drill' |
  'Other' |
  'Tool Belts' |
  'Storage' |
  'Workbench' |
  'Safty Gear' |
  'Fasteners' |
  'ForgeFlex' |
  'MightiCraft' |
  'Show only eco'


export type country = 'ID' | 'NL' | 'US' | 'TH'

export type NavBarOption = 'HOME' | 'CATEGORIES' | 'CONTACT' | 'SIGN-IN' | 'LANG'

export type paymentOption = 'BANK TRANSFER' | 'COD' | 'CC' | 'Payleter' | 'GIFT CARD' 

export type apiParams ='by_category' | 'by_brand' | 'eco_friendly' | 'q' | 'page' | 'between' | 'price';