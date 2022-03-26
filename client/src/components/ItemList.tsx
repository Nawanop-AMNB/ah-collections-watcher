import React, { ReactNode } from "react";

export type IItemList<T> = {
  label?: string;
  items: T[];
  render: (item: T) => ReactNode;
};

function ItemList<T>({ items, render }: IItemList<T>) {
  return <>{items.map((item) => render(item))}</>;
}

export default ItemList;
