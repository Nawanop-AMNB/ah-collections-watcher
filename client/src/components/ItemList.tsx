import React, { ReactNode } from "react";

export type IItemList<T> = {
  label?: string;
  items: T[];
  cond?: (item: T) => boolean;
  render: (item: T, index: number) => ReactNode;
};

function ItemList<T>({ items, cond, render }: IItemList<T>) {
  const filtered = cond ? items.filter(cond) : items;
  return <>{filtered.map((item, index) => render(item, index))}</>;
}

export default ItemList;
