import { Router, Request, Response, NextFunction } from "express";
import memoryCache from "memory-cache";

import errorMiddleware from "../../helpers/middlewares/error-middleware";
import { dynamoDB } from "../../helpers/database/dynamo";

import { uploadByMulter } from "../../services/image.upload.service";
import resize from "../../services/image.resize.service";

import Asset from "../../models";

class AssetController {

  public path = "/assets";

  private router: Router = Router();

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
    const cacheData = memoryCache.get(key);
    if (cacheData) {
      response.writeHead(200, { "Content-Type": `image/jpeg`, "Content-Length": cacheData.length });
      response.end(cacheData);
    } else {
      const maxW = 2048;
      const maxH = 2048;
      try {
        const { path, width, height } = request.query;

        let widthInt, heightInt;
        width ? (widthInt = parseInt(width) > maxW ? maxW : parseInt(width)) : (widthInt = widthInt);
        height ? (heightInt = parseInt(height)) > maxH ? maxH : parseInt(height) : (heightInt = heightInt);

        const resizedBuffer = await resize(key, path, 'jpeg', width, height);

        response.writeHead(200, { "Content-Type": `image/jpeg`, "Content-Length": resizedBuffer.length });
        response.end(resizedBuffer);
      } catch (error) {
        console.error(error);
        errorMiddleware(error, request, response, next);
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
