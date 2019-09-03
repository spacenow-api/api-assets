import { Router, Request, Response, NextFunction } from "express";
import sharp from "sharp";
import axios from "axios";
import memoryCache from "memory-cache";

import errorMiddleware from "../../helpers/middlewares/error-middleware";
import Asset from "../../models";
import { dynamoDB } from "../../helpers/database/dynamo";
import upload from "../../services/image.upload.service";
import resize from "../../services/image.resize.service";

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

  private resizeAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const key = "__asset__" + request.originalUrl || request.url;
    const cacheData = memoryCache.get(key);
    if (cacheData) {
      response.writeHead(200, {
        "Content-Type": `image/${request.query.format || "png"}`,
        "Content-Length": cacheData.length
      });
      response.end(cacheData);
    } else {
      try {
        const widthString = request.query.width;
        const maxW = 2048;
        const maxH = 2048;
        const heightString = request.query.height;
        const format = request.query.format;
        const path = request.query.path;

        let width, height;
        widthString
          ? (width =
              parseInt(widthString) > maxW ? maxW : parseInt(widthString))
          : (width = width);
        heightString
          ? (height = parseInt(heightString)) > maxH
            ? maxH
            : parseInt(heightString)
          : (height = height);

        const resizedBuffer = await resize(key, path, format, width, height);

        response.writeHead(200, {
          "Content-Type": `image/${format || "png"}`,
          "Content-Length": resizedBuffer.length
        });
        response.end(resizedBuffer);
      } catch (error) {
        console.error(error);
        errorMiddleware(error, request, response, next);
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
