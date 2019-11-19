import { Router, Request, Response, NextFunction } from 'express';
import memoryCache from 'memory-cache'

import errorMiddleware from '../../helpers/middlewares/error-middleware';
import { dynamoDB } from '../../helpers/database/dynamo';

import { uploadByMulter } from '../../services/image.upload.service';
import resize from '../../services/image.resize.service';

import Asset from '../../models';

class AssetController {

  private MAX_W = 2048;

  private MAX_H = 2048;

  public path = '/assets';

  private router: Router = Router();

  private mCache = new memoryCache.Cache();

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

  private getMediaHeaders(response: Response, content: any) {
    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': content.length,
      'Cache-Control': 'private',
      'max-age': 31536000
    })
    return response;
  }

  private resizeAsset = async (request: Request, res: Response, next: NextFunction) => {
    const key = '__asset__' + request.originalUrl || request.url;
    const cacheData: any = this.mCache.get(key);
    if (cacheData) {
      this.getMediaHeaders(res, cacheData).end(cacheData);
    } else {
      try {
        const { path, width, height } = request.query;

        let widthInt, heightInt;
        width ? (widthInt = parseInt(width)) > this.MAX_W ? this.MAX_W : parseInt(width) : (widthInt = widthInt);
        height ? (heightInt = parseInt(height)) > this.MAX_H ? this.MAX_H : parseInt(height) : (heightInt = heightInt);

        const resizedBuffer = await resize(path, widthInt, heightInt);
        this.mCache.put(key, resizedBuffer);

        this.getMediaHeaders(res, resizedBuffer).end(resizedBuffer);
      } catch (err) {
        console.error(err);
        errorMiddleware(err, request, res, next);
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
      await uploadByMulter.single('file')(request, response, async error => {
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
