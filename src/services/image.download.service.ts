import axios from 'axios';
import fs from 'fs';
import * as config from '../config';

const download = async (url: string, photoId: number, callback: any) => {
	const path = `${config.imagePath}/${photoId}.png`;
	const output = fs.createWriteStream(path);
	const response = await axios.get(url, { responseType: 'stream' });
	response.data.pipe(output);
	response.data.on('end', callback);
};

export default download;
