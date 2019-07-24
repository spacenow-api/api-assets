import { Router, Request, Response, NextFunction } from "express";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import { ListingPhotos } from "../../models";

class LegacyPhotosController {
  private router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(
      `/photos/legacy`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const photos: any = await ListingPhotos.findAll();
          res.send(photos);
        } catch (error) {
          sequelizeErrorMiddleware(error, req, res, next);
        }
      }
    );
  }
}

export default LegacyPhotosController;
