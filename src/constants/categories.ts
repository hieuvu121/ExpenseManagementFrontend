import type { CategoryId } from "../types/domain";
import { PALETTE } from "./palette";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Literal hex — Chart.js and the inline dot background cannot read a class. */
  color: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  food: { id: "food", label: "Food & drink", color: PALETTE.rose },
  market: { id: "market", label: "Groceries", color: PALETTE.moss },
  bill: { id: "bill", label: "Utilities", color: PALETTE.cobalt },
  home: { id: "home", label: "Household", color: PALETTE.gold },
  move: { id: "move", label: "Transport", color: PALETTE.teal },
  other: { id: "other", label: "Other", color: PALETTE.inkMuted },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);

/**
 * Keyword patterns used to guess a category from an expense title, in priority
 * order. Matched against diacritic-stripped text, so both "đi chợ" and "di cho"
 * hit the same rule. English and Vietnamese share one list.
 */
const CATEGORY_KEYWORDS: [CategoryId, RegExp][] = [
  [
    "market",
    /\b(di cho|sieu thi|coopmart|bach hoa|winmart|rau cu|thit ca|gao|trung|thuc pham|grocer|groceries|supermarket|market)\b/,
  ],
  [
    "move",
    /\b(xang|taxi|grab|be|xe may|xe om|ve xe|gui xe|do xang|di lai|may bay|tau|fuel|petrol|gas station|uber|ride|bus|train|flight|parking)\b/,
  ],
  [
    "home",
    /\b(nuoc rua|xa phong|bot giat|giay|chen bat|bong den|o dien|voi nuoc|may loc|sua chua|do dung|noi that|thue nha|tien nha|sua voi|rent|repair|detergent|soap|furniture|light bulb|cleaning)\b/,
  ],
  [
    "bill",
    /\b(dien|nuoc|internet|wifi|rac|mang|truyen hinh|hoa don|phi|dich vu|chung cu|gas|electric|electricity|water|bill|trash|utilities|subscription)\b/,
  ],
  [
    "food",
    /\b(an|com|lau|nuong|pho|bun|mi|tra sua|ca phe|cafe|quan|nha hang|oc|nhau|banh|do an|kichi|bia|ruou|kem|che|tiec|dinner|lunch|breakfast|coffee|beer|snack|restaurant|hotpot|takeout|pizza|cake|ice cream|dessert|milk tea|boba|banh kem)\b/,
  ],
];

export { CATEGORY_KEYWORDS };
