import { CATEGORIES } from "../../constants/categories";
import type { CategoryId } from "../../types/domain";

export function CategoryDot({ category }: { category: CategoryId }) {
  return (
    <span
      aria-hidden
      className="mr-[7px] inline-block h-[7px] w-[7px] rounded-full align-[1px]"
      style={{ background: CATEGORIES[category].color }}
    />
  );
}
