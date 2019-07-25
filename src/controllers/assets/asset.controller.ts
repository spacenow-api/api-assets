import { Router, Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";
import Asset from "../../models";
import upload from "../../services/image.upload.service";
import download from "../../services/image.download.service";
import { dynamoDB } from "../../helpers/database/dynamo";
import { ListingPhotos } from "../../models";
import fs from "fs";

class AssetController {
  public path = "/assets";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAssets);
    this.router.get(`${this.path}/:id`, this.getAsset);
    this.router.post(`${this.path}/:folder`, this.createAsset);
    this.router.get(`${this.path}/images/resize`, this.resizeAsset);
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

  private resizeAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const photos: any = await ListingPhotos.findAll({
      where: {
        listingId: 28
      }
    });

    // return photos.map(async (photo: { name: string; listingId: number }) => {
    try {
      download(
        "https://sandpit-spacenow-images.s3.ap-southeast-2.amazonaws.com/upload/eb4bdd32ca4bc8f2f0a82d1ad8084618.png",
        34,
        "image/png",
        () => {
          fs.readFile("34.png", async (error, data) => {
            const form = new FormData();
            const getHeaders = form.getHeaders();
            form.append("file", data);
            await axios.post(
              `http://0.0.0.0:6007/assets/34`, //`http://0.0.0.0:6007/assets/${photo.listingId}`,
              form,
              {
                headers: {
                  ...getHeaders
                }
              }
            );
          });
        }
      );
    } catch (error) {
      console.error(error);
      response.send(error);
    }
    // });
  };

  private createAsset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await upload.single("file")(request, response, async error => {
        if (error) response.send(error);
        else {
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
