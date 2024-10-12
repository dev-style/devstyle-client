import mongoose from "mongoose";

export interface IGoodie extends mongoose.Document {
  name: string;
  description: string;
  slug: string;
  fromCollection:any;
  promoPercentage: number;
  price: number;
  inPromo: boolean;
  views: number;
  size: Array<ISize>;
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
  