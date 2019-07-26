import { Asset } from "./asset.model";
import { AssetDTO } from "./assetDTO.model";
import { ListingPhotos } from "./photos.model";
import { ListingAssets } from "./listingAssets.model";

export { Asset as default, AssetDTO, ListingPhotos, ListingAssets };

export const sequelizeModels = [ListingPhotos, ListingAssets];
