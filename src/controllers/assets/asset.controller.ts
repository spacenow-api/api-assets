import { Router, Request, Response, NextFunction } from "express";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import authMiddleware from "../../helpers/middlewares/auth-middleware";
import IAsset from "./asset.interface";
import { Asset } from "../../models";
import upload from "../../services/image.upload.service";

class AssetController {
  public path = "/assets";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAssets);
    this.router.get(`${this.path}/:id`, this.getAsset);
    this.router.post(this.path, this.createAsset);
    this.router.patch(this.path, this.createAsset);
  }

  private getAssets = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const assets = await Asset.findAll({ where: { parentId: null } });
      response.send(assets);
    } catch (error) {
      console.log(error);
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  private getAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const asset = await Asset.findOne({
        where: { id: request.params.id }
      });
      response.send(asset);
    } catch (error) {
      console.log(error);
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  private createAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await upload.single("photo")(request, response, async err => {
        if (err) response.send(err);
        else {
          const file: any = request.file;
          const filename: string = file["original"].key.replace(
            "-original",
            ""
          );
          try {
            const data = request.body;
            const asset: IAsset = await Asset.create({
              ...data,
              filename
            });
            response.send(asset);
          } catch (error) {
            console.log(error);
            sequelizeErrorMiddleware(error, request, response, next);
          }
        }
      });
    } catch (error) {
      response.send(error);
      // sequelizeErrorMiddleware(error, request, response, next);
    }
  };
}

export default AssetController;
