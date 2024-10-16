export interface ICart {
  [key: string]: IGoodieForCart;
}

export interface IGoodie extends IGoodieForCart {
  availableColors: string[];
  likes: number;
  views: number;
  description:string;
}

export interface IGoodieForCart {
  cartID: string;
  _id: string;
  slug: string;
  name: string;
  mainImage: IUrlWithColor;
  quantity: number;
  price: number;
  inPromo: boolean;
  promoPercentage: number;
  images: IUrlWithColor[];
  backgroundColors: string[];
  selectedColor?: string;
  selectedSize?: string;
  fromCollection: ICollectionForCart;
  sizes: IGoodieSize[];
  color: string;
}

export interface IUrlWithColor extends IUrl {
  color: string;
}
export interface IGoodieSize {
  _id: string;
  size: string;
}

export interface ICollectionForCart {
  _id: string;
  slug: string;
  title: string;
}

export interface ICollection extends ICollectionForCart {
  colors: string;
  image: IUrl;
  views: number;
}

export interface IUrl {
  url: string;
}

export interface IAnnouncement {
  _id: string;
  link: string;
  text: string;
}

export interface IPartner {
  _id: string;
  name: string;
  logoColor: IUrl;
  logoWhite: IUrl;
  logoBlack: IUrl;
  link: string;
  show: boolean;
}

export interface IAffiliation {
  _id: string;
  ambassadorId: string;
  affiliateCode: string;
  affiliateLink: string;
  clicksCount: number;
  createdAt: Date;
}

export interface IAmbassador {
  _id: string;
  name: string;
  image: IUrl;
  social: (ISocial & { link: string })[];
  colors: string;
  show: boolean;
}

export interface ISocial {
  _id: number;
  name: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  authToken?: string;
}

export interface IOrderData {
  goodies: Record<string, string | number>[];
  email: string;
  number?: number;
  status: string;
  name: string;
}
