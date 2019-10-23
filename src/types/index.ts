export type UserSignUp = {
  email: string;
  username: string;
  full_name: string;
  telephone: number;
  location: string;
  password: string;
};

export type UserSignIn = {
  username: string;
  password: string;
};

export type ResponseObject = {
  success: boolean;
  data: any;
  message: string;
  token?: string;
};
