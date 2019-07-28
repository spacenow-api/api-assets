import { Router, Request, Response, NextFunction } from 'express';
import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware';
import HttpException from '../../helpers/exceptions/HttpException';
import { ListingPhotos, Listing } from '../../models';
import upload from '../../services/image.upload.service';
import deletePhoto from '../../services/image.delete.service';

class LegacyPhotosController {
	public path = '/photos';
	private router: Router = Router();

	constructor() {
		this.intializeRoutes();
	}

	private intializeRoutes() {
		this.router.get(`${this.path}/:listingId`, this.getPhotos);
		this.router.post(`${this.path}/:listingId`, this.createListingPhotos);
		this.router.delete(
			`${this.path}/:listingId/:photoId`,
			this.deleteListingPhoto,
		);
		this.router.put(
			`${this.path}/:listingId/:photoId`,
			this.setListingPhotoCover,
		);
		this.router.post(`${this.path}/upload/:listingId`, this.uploadListingPhoto);
	}

	private getPhotos = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const lId = request.params.listingId;
			const photos: any = await ListingPhotos.findAll({
				where: { id: lId },
			});
			response.send(photos);
		} catch (error) {
			sequelizeErrorMiddleware(error, request, response, next);
		}
	};

	private createListingPhotos = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const data = request.body;
			const photo: any = await ListingPhotos.create(data);
			response.send(photo);
		} catch (error) {
			sequelizeErrorMiddleware(error, request, response, next);
		}
	};

	private setListingPhotoCover = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		try {
			await ListingPhotos.update(
				{ isCover: 0 },
				{ where: { listingId: request.params.listingId } },
			);
			await ListingPhotos.update(
				{ isCover: 1 },
				{ where: { id: request.params.photoId } },
			);
			response.status(200).send('Cover Photo Updated');
		} catch (error) {
			sequelizeErrorMiddleware(error, request, response, next);
		}
	};

	private deleteListingPhoto = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const where: { id: number } = { id: request.params.photoId };
			const photoObj: ListingPhotos | null = await ListingPhotos.findOne({
				where,
			});
			if (!photoObj) throw new HttpException(400, 'A Photo must exist.');
			await ListingPhotos.destroy({ where });
			response.status(200).send('Photo Deleted');
		} catch (error) {
			sequelizeErrorMiddleware(error, request, response, next);
		}
	};

	private uploadListingPhoto = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const where: { id: number } = { id: request.params.listingId };
			const listingObj: Listing | null = await Listing.findOne({ where });
			if (!listingObj) throw new HttpException(400, 'A Listing must exist.');
			await upload.single('file')(request, response, async error => {
				if (error) {
					console.error('ERROR', error);
					response.send(error);
				} else {
					const file: any = request.file;
					try {
						const toSave = Object.assign(
							{},
							{
								listingId: parseInt(request.params.listingId),
								name: file.Location,
								bucket: file.Bucket,
								region: 'ap-southeast-2',
								type: file.mimetype,
								key: file.Key,
							},
						);
						const photo: any = await ListingPhotos.create(toSave);
						response.send(photo);
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

export default LegacyPhotosController;
