import sharp from "sharp";
import axios from "axios";
import memoryCache from "memory-cache";

const resize = async (
  key: string,
  path: string,
  format: string,
  width?: number,
  height?: number
) => {
  const fileResponse = await axios({
    url: path,
    method: "GET",
    responseType: "arraybuffer"
  });
  const buffer = Buffer.from(fileResponse.data, "base64");
  let transform = sharp(buffer);

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  const resizedBuffer = await transform.toBuffer();
  memoryCache.put(key, resizedBuffer, 24 * 3.6e6); // Expire in 24 hours.

  return resizedBuffer;
};

export default resize;
