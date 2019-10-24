import { ResponseObject } from '../types';
import Datauri from 'datauri';
import path from 'path';

export function generateResponse(response: ResponseObject) {
  if (response)
    return {
      success: response.success ? true : false,
      data: response.data ? response.data : [],
      message: response.message ? response.message : 'Failed on Server-Side',
      token: response.token ? response.token : undefined,
    };
  else
    return {
      success: false,
      message: 'Server Error (please contact and provide the case to fix)',
    };
}

export const dataUri = (req: any) => {
  const dUri = new Datauri();
  return dUri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer,
  );
};
