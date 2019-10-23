require('dotenv').config();

export let PORT = Number(process.env.PORT) || 3000;

export let USER = process.env.USER;
export let HOST = process.env.HOST;
export let DATABASE_NAME = process.env.DATABASE_NAME;
export let PASSWORD = process.env.PASSWORD;
export let DB_PORT = Number(process.env.DB_PORT) || 5432;

export const SERVER_OK = 200;
export const SERVER_BAD_REQUEST = 400;
export const SERVER_NOT_FOUND = 404;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const API_SECRET = process.env.API_SECRET || '';
