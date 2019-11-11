import { Router, Request, Response, NextFunction } from "express";

import errorMiddleware from "../../helpers/middlewares/error-middleware";
import { dynamoDB } from "../../helpers/database/dynamo";
import { getInstance } from './../../helpers/database/redis';

import { uploadByMulter } from "../../services/image.upload.service";
import resize from "../../services/image.resize.service";

import Asset from "../../models";

class AssetController {

  private MAX_W = 2048;

  private MAX_H = 2048;

  private IMAGE_TYPE = 'image/png'

  public path = "/assets";

  private router: Router = Router();

  private redis = getInstance();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/`, this.resizeAsset);
    this.router.get(`${this.path}`, this.getAssets);
    this.router.get(`${this.path}/:assetId`, this.getAsset);
    this.router.post(`${this.path}`, this.createAsset);
    this.router.delete(`${this.path}/:assetId`, this.deleteAsset);
  }

  private resizeAsset = async (request: Request, response: Response, next: NextFunction) => {
    const key = "__asset__" + request.originalUrl || request.url;
    const cacheData = await this.redis.get(key);
    if (cacheData) {
      const resizedBuffer = Buffer.from(cacheData, "base64");
      response.writeHead(200, { "Content-Type": this.IMAGE_TYPE, "Content-Length": resizedBuffer.length });
      response.end(resizedBuffer);
    } else {
      try {
        const { path, width, height } = request.query;

        let widthInt, heightInt;
        width ? (widthInt = parseInt(width)) > this.MAX_W ? this.MAX_W : parseInt(width) : (widthInt = widthInt);
        height ? (heightInt = parseInt(height)) > this.MAX_H ? this.MAX_H : parseInt(height) : (heightInt = heightInt);

        const resizedBuffer = await resize(path, widthInt, heightInt);
        await this.redis.set(key, resizedBuffer.toString('base64'));

        response.writeHead(200, { "Content-Type": this.IMAGE_TYPE, "Content-Length": resizedBuffer.length });
        response.end(resizedBuffer);
      } catch (err) {
        console.error(err);
        errorMiddleware(err, request, response, next);
      }
    }
  };

  private getAssets = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assets: Array<Asset> = new Array();
      for await (const item of dynamoDB.scan(Asset)) {
        assets.push(item);
      }
      response.send(assets);
      response.send(assets);
    } catch (error) {
      errorMiddleware(error, request, response, next);
    }
  };

  private getAsset = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const aId = request.params.id;
      const asset: Asset = await dynamoDB.get(
        Object.assign(new Asset(), { id: aId })
      );
      response.send(asset);
    } catch (error) {
      errorMiddleware(error, request, response, next);
    }
  };

  private createAsset = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await uploadByMulter.single("file")(request, response, async error => {
        if (error) {
          console.error(error);
          response.send(error);
        } else {
          const file: any = request.file;
          try {
            const data = request.body;
            const toSave = Object.assign(new Asset(), {
              ...data,
              fileType: file.mimetype,
              fileName: file.originalname,
              sizes: {
                xs: file.xs.Location,
                sm: file.sm.Location,
                md: file.md.Location,
                lg: file.lg.Location,
                original: file.original.Location
              },
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            });
            dynamoDB
              .put(toSave)
              .then(dataSaved => {
                response.send(dataSaved);
              })
              .catch(error => response.send(error));
          } catch (error) {
            console.error(error);
            response.send(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
      response.send(error);
    }
  };

  private deleteAsset = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.end();
    } catch (error) {
      errorMiddleware(error, request, response, next);
    }
  };
}

export default AssetController;
