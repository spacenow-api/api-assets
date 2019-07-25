import * as Blob from "blob";

const dataURItoBlob = (dataURI: string) => {
  var byteString: string;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  var mimeString: string = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  var ia: Uint8Array = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export default dataURItoBlob;
