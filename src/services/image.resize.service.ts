import sharp from "sharp";
import axios from "axios";

const resize = async (path: string, width?: number, height?: number) => {
  const fileResponse = await axios({ url: path, method: "GET", responseType: "arraybuffer" });
  const buffer = Buffer.from(fileResponse.data, "base64");
  const transform = sharp(buffer).toFormat("jpeg");
  if (width || height) {
    transform.resize(width, height);
  }
  return transform.toBuffer();
}

export default resize;
