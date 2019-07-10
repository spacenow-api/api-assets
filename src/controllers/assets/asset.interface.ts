interface IAsset {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  accessControl: string;
  isActive: boolean;
}

interface IAssetSize {
  path: string;
}

export { IAsset as default, IAssetSize };
