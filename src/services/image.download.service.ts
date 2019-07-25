import fs from "fs";
import https from "https";

const download = async (
  path: string,
  photoId: number,
  mimetype: string,
  callback: any
) => {
  var filename;
  if (mimetype === "image/jpeg") filename = `${photoId}.jpeg`;
  else filename = `${photoId}.png`;

  const file = fs.createWriteStream(filename);
  https.get(path, response => {
    response.pipe(file).on("finish", callback);
  });
};

export default download;
