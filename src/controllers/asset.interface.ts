interface IAsset {
  id: string;
  title: string;
  description: string;
  file: File;
  accessPermission: string;
  isActive: boolean;
}

interface IAssetItem extends IAsset {
  accessUrl: string;
  fileName: string;
}

export { IAsset as default, IAssetItem };
