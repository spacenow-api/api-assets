import { Asset } from './asset.model';
import { AssetDTO } from './assetDTO.model';
import { ListingPhotos } from './photos.model';
import { ListingAssets } from './listingAssets.model';
import { Listing } from './listing.model';

export { Asset as default, AssetDTO, ListingPhotos, ListingAssets, Listing };

export const sequelizeModels = [ListingPhotos, ListingAssets, Listing];
