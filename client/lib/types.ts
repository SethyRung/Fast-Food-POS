export type CategoryType = {
  id?: number | undefined;
  name: string | undefined;
};

export type ProductType = {
  id?: number | undefined;
  name: string | undefined;
  price: number | undefined;
  category: CategoryType | undefined;
  photo: string | undefined;
};
