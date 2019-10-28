require('dotenv').config();

export const PORT = Number(process.env.PORT) || 4000;

export const DB_USER = process.env.DB_USER;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = Number(process.env.DB_PORT) || 5432;

export const SERVER_OK = 200;
export const SERVER_BAD_REQUEST = 400;
export const SERVER_NOT_FOUND = 404;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const API_SECRET = process.env.API_SECRET || '';

// HEROKU
export let DATABASE_URL = process.env.DATABASE_URL;
