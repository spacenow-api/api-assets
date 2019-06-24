import { Router, Request, Response, NextFunction } from 'express';
import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';
import authMiddleware from '../helpers/middlewares/auth-middleware';
import IAsset from './asset.interface';
import { Asset } from '../models';
 
class AssetController {

  public path = '/assets';
  public router = Router();
  
  constructor() {
    this.intializeRoutes();
  }
 
  private intializeRoutes() {
    this.router.get(this.path, this.getRootAssets);
    this.router.get(`${this.path}/:id`, this.getAsset);
    this.router.post(this.path, authMiddleware, this.createAsset);
    this.router.patch(this.path, authMiddleware, this.createAsset);
  }
 
  private getRootAssets = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assets: IAsset[] = await Asset.findAll({ where: {parentId: null} });
      response.send(assets);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

  private getAsset = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const asset: IAsset = await Asset.findOne({ 
        where: {id: request.params.id}, 
        include: [{ model: Asset, as: 'children' }]
      });
      response.send(asset);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }
 
  private createAsset = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body;
    try {
      const asset = await Asset.create(data);
      response.send(asset);
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

}
 
export default AssetController;