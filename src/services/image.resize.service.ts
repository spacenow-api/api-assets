import sharp from "sharp";
import axios from "axios";

const resize = async (path: string, width?: number, height?: number) => {
  const fileResponse = await axios({ url: path, method: "GET", responseType: "arraybuffer" });
  const buffer = Buffer.from(fileResponse.data, "base64");
  let transform = sharp(buffer);
  transform = transform.toFormat("jpeg");
  if (width || height) {
    transform = transform.resize(width, height);
  }
  return await transform.toBuffer();
}

export default resize;
