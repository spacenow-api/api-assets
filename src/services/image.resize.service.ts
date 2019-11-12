import sharp from "sharp";
import axios from "axios";
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran from 'imagemin-jpegtran'

const resize = async (path: string, width?: number, height?: number) => {
  const fileResponse = await axios({ url: path, method: "GET", responseType: "arraybuffer" });
  const buffer = Buffer.from(fileResponse.data, "base64");

  // Compression...
  const bufferResult = await imagemin.buffer(buffer, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: [0.3, 0.5] })
    ]
  });

  // Crop and formatting...
  const transform = sharp(bufferResult).toFormat("jpeg");
  if (width || height) {
    transform.resize(width, height);
  }

  return transform.toBuffer();
}

export default resize;
