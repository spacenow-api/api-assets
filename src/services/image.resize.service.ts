import sharp from "sharp";
// import request from "request";

const resize = (
  path: string,
  format: string,
  width?: number,
  height?: number
) => {
  // const readStream = request(path);
  // let transform = sharp();

  // if (format) {
  //   transform = transform.toFormat(format);
  // }

  // if (width || height) {
  //   transform = transform.resize(width, height);
  // }

  // return readStream.pipe(transform);
  return;
};

export default resize;
