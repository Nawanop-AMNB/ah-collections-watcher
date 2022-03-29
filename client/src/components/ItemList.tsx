import React, { ReactNode } from "react";

export type IItemList<T> = {
  items: T[];
  label?: string;
  render: (item: T, index: number) => ReactNode;
  sort?: (i1: T, i2: T) => number;
};

function ItemList<T>({ items, sort, render }: IItemList<T>) {
  const list = sort ? items.sort(sort) : items;
  return <>{list.map((item, index) => render(item, index))}</>;
}

export default ItemList;
