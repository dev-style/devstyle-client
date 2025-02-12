import { ICart } from "@/app/lib/interfaces";

export const importAll = (paths: string[]) => {
  paths = paths.slice(0, paths.length / 2); // remove the extra long paths added by webpack
  let images: { [index: string]: string } = {};
  paths.map(
    (item: string, i: number) => (images[item.replace("./", "")] = paths[i])
  );
  return images;
};

export const calculatePromoPrice = (price: number, promoPercentage: number) =>
  Number((price - (price * promoPercentage) / 100).toFixed(0));

export const scrollToTop = () => {
  try {
    if (document.querySelector("body")) {
      document.querySelector("body")?.scrollIntoView(true);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTotalPrice = (cart: ICart) => {
  let total = Object.values(cart).reduce(
    (acc, goodie, i) =>
    (acc +=
      goodie.quantity *
      (goodie.inPromo
        ? calculatePromoPrice(goodie.price, goodie.promoPercentage)
        : goodie.price)),
    0
  );

  return total;
};

export const getCartCount = (cart: ICart) => {
  let count = Object.entries(cart).length;
  return count;
};

export const stripHtmlTags = (html: string): string => {

  if (!html) return "";
  return html.replace(/<[^>]*>/g, ""); // Supprime toutes les balises HTML
}