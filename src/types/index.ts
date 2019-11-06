export type UserSignUp = {
  email: string;
  username: string;
  full_name: string;
  phone_number: number;
  location: string;
  password: string;
  avatar: string;
};

export type UserSignIn = {
  credential: string;
  password: string;
};

export type ResponseObject = {
  success: boolean;
  data: any;
  message: string;
  token?: string;
};

export type DecodedObject = {
  id: number;
  iat: number;
};

export type ReqEditProfileObject = {
  full_name: string;
  phone_number: string;
  location: string;
  avatar: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type PostRequestObject = {
  item_name: string;
  buy_date: string;
  exp_date: string;
  category: string;
  description: string;
  tag: 'Available' | 'Expired' | 'Unavailable';
  image?: string;
};
