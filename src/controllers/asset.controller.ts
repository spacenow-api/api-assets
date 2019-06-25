import { Router, Request, Response, NextFunction } from 'express';
import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';
import authMiddleware from '../helpers/middlewares/auth-middleware';
import IAsset, { IAssetItem } from './asset.interface';
import { Asset } from '../models';
 
class AssetController {

  public path = '/assets';
  public router = Router();
  
  constructor() {
    this.intializeRoutes();
  }
 
  private intializeRoutes() {
    this.router.get(this.path, this.getAssets);
    this.router.get(`${this.path}/:id`, this.getAsset);
    this.router.post(this.path, authMiddleware, this.createAsset);
    this.router.patch(this.path, authMiddleware, this.createAsset);
  }
 
  private getAssets = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assets: IAssetItem[] = await Asset.findAll({ where: {parentId: null} });
      response.send(assets);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

  private getAsset = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const asset: IAssetItem = await Asset.findOne({ 
        where: {id: request.params.id}, 
      });
      response.send(asset);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }
 
  private createAsset = async (request: Request, response: Response, next: NextFunction) => {
    const data: IAsset = request.body;
    try {
      const asset = await Asset.create(data);
      response.send(asset);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

}
 
export default AssetController;