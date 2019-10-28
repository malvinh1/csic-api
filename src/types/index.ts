export type UserSignUp = {
  email: string;
  username: string;
  fullName: string;
  telephone: number;
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
