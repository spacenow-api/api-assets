import { Router, Request, Response, NextFunction } from "express";
import sharp from "sharp";
import axios from 'axios';
import memoryCache from "memory-cache";

import errorMiddleware from "../../helpers/middlewares/error-middleware";
import Asset from "../../models";
import { dynamoDB } from "../../helpers/database/dynamo";
import upload from "../../services/image.upload.service";

class AssetController {

  public path = "/assets";

  private router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`${this.path}`, this.getAssets);
    this.router.get(`${this.path}/:assetId`, this.getAsset);
    this.router.post(`${this.path}`, this.createAsset);
    this.router.delete(`${this.path}/:assetId`, this.deleteAsset);
    this.router.get(`/`, this.resizeAsset);
  }

  private resizeAsset = async (req: Request, res: Response, next: NextFunction) => {
    const key = "__asset__" + req.originalUrl || req.url;
    const cacheData = memoryCache.get(key);
    if (cacheData) {
      res.writeHead(200, { 'Content-Type': `image/${req.query.format || "png"}`, 'Content-Length': cacheData.length });
      res.end(cacheData);
    } else {
      try {
        const path = req.query.path;
        const format = req.query.format;
        const widthString = req.query.width;
        const heightString = req.query.height;

        let width, height;
        widthString ? (width = parseInt(widthString)) : (width = width);
        heightString ? (height = parseInt(heightString)) : (height = height);

        const fileResponse = await axios({ url: path, method: 'GET', responseType: 'arraybuffer' })
        const buffer = Buffer.from(fileResponse.data, 'base64')

        let transform = sharp(buffer);
        if (format) transform = transform.toFormat(format);
        if (width || height) transform = transform.resize(width, height);

        const resizedBuffer = await transform.toBuffer();
        memoryCache.put(key, resizedBuffer, 24 * 3.6e6); // Expire in 24 hours.

        res.writeHead(200, { 'Content-Type': `image/${format || "png"}`, 'Content-Length': resizedBuffer.length });
        res.end(resizedBuffer);
      } catch (error) {
        console.log(error);
        errorMiddleware(error, req, res, next);
      }
    }
  };

  private getAssets = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
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

  private getAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
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

  private createAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await upload.single("file")(request, response, async error => {
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

  private deleteAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      console.log("chamou");
    } catch (error) {
      errorMiddleware(error, request, response, next);
    }
  };
}

export default AssetController;
