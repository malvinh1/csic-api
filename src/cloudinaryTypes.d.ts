declare module 'cloudinary' {
  export var config: any;
  export var uploader: any;
}

declare module 'datauri' {
  export default class Datauri {
    constructor(): any {}
    format(path: string, buffer: any): any {}
  }
}
