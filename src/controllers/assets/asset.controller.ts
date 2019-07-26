import { Router, Request, Response, NextFunction } from "express";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import axios from "axios";
import FormData from "form-data";
import Asset from "../../models";
import upload from "../../services/image.upload.service";
import download from "../../services/image.download.service";
import { dynamoDB } from "../../helpers/database/dynamo";
import { ListingPhotos, ListingAssets } from "../../models";
import fs from "fs";
import * as config from "../../config";

class AssetController {
  public path = "/assets";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAssets);
    this.router.get(`${this.path}/:id`, this.getAsset);
    this.router.get(
      `${this.path}/listing/:listingId`,
      this.getAssetsByListingId
    );
    this.router.post(`${this.path}/:folder`, this.createAsset);
    this.router.post(`/listingAsset`, this.createListingAsset);
    this.router.post(`${this.path}/resize/:listingId`, this.resizeAsset);
    this.router.patch(this.path, this.createAsset);
  }

  private getAssets = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const assets = Array<Asset>();
      for await (const item of dynamoDB.scan(Asset)) {
        assets.push(item);
      }
      response.send(assets);
    } catch (error) {
      response.send(error);
    }
  };

  private getAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const pId = request.params.id;
      const asset = await dynamoDB.get(Object.assign(new Asset(), { id: pId }));
      response.send(asset);
    } catch (error) {
      response.send(error);
    }
  };

  private getAssetsByListingId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const assets: any = await ListingAssets.findAll({
        where: {
          listingId: request.params.listingId
        }
      });
      response.send(assets);
    } catch (error) {
      response.send(error);
    }
  };

  private resizeAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const photos: any = await ListingPhotos.findAll({
      where: {
        listingId: request.params.listingId
      }
    });
    const listingAssetData: any = [];

    try {
      const promise = photos.map(
        async (photo: {
          name: string;
          listingId: number;
          isCover: boolean;
        }) => {
          download(photo.name, photo.listingId, async () => {
            const form = new FormData();
            const getHeaders = form.getHeaders();
            form.append(
              "file",
              fs.createReadStream(`${config.imagePath}/${photo.listingId}.jpeg`)
            );
            const resp = await axios.post(
              `http://0.0.0.0:6007/assets/${photo.listingId}`,
              form,
              {
                headers: {
                  ...getHeaders
                }
              }
            );
            const listingAsset = await axios.post(
              `http://0.0.0.0:6007/listingAsset`,
              {
                assetId: resp.data.id,
                isCover: photo.isCover,
                listingId: photo.listingId
              }
            );
            console.log(listingAsset.data);
            listingAssetData.push(listingAsset.data);
          });
        }
      );
      return await Promise.all(promise).then(() =>
        response.send(listingAssetData)
      );
    } catch (error) {
      console.error(error);
    }
  };

  private createListingAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const data = request.body;
    try {
      const listingAsset = await ListingAssets.create(data);
      response.send(listingAsset);
    } catch (error) {
      console.error(error);
      sequelizeErrorMiddleware(error, request, response, next);
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
}

export default AssetController;
