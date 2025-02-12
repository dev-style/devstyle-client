import mongoose from "mongoose";

export interface IGoodie extends mongoose.Document {
  name: string;
  description: string;
  slug: string;
  fromCollection: any;
  promoPercentage: number;
  price: number;
  inPromo: boolean;
  views: number;
  sizes: Array<ISize>;
  images: Array<{
    public_id: string;
    url: string;
  }>;
  mainImage: {
    public_id: string;
    url: string;
  };
  availableColors: Array<string>;
  backgroundColors: Array<string>;
  likes: number;
  show: boolean;
  etsy: string;
}

export interface ISize extends mongoose.Document {
  id: string;
  size: string;
}

export interface ICloudinaryUploadResponse extends mongoose.Document {
  public_id: string;
  secure_url: string;
}

export interface ICollection extends mongoose.Document {
  title: string;
  slug: string;
  colors: string;
  image: {};
  views: number;
  show: boolean;
}

export interface ISize extends mongoose.Document {
  id: string;
  size: string;
}

export interface IOrder extends mongoose.Document {
  name: string;
  goodies: [
    {
      name: string;
      price: number;
      quantity: number;
      total: number;
    }
  ];

  status: string;
  email: string;
  number?: number;
  initDate: Date;
  city:string;
  district:string;
  paymentMethod:string;
}
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isActive: boolean;
  phone: number;
  address: string;
}

export interface ICombo extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  inPromo: boolean;
  promoPercentage?: number;
  items: string[]; // Array of Goodie IDs
  mainImage: string;
  images: string[];
  availableColors: string[];
  backgroundColors: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IDiscount extends mongoose.Document{
  code:string;
  percent:number;
  isActive:boolean;
  limit:number;
  uses:number;
  goodies:any
}