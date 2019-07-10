import { IsUUID, IsString, IsBoolean, IsDate } from "class-validator";
import uuidV4 from "uuid/v4";

export class AssetDTO {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  fileType!: string;

  @IsString()
  fileName!: string;

  @IsString()
  accessControl!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsDate()
  updatedAt!: Date;

  constructor(
    title: string,
    description: string,
    fileType: string,
    fileName: string,
    accessControl: string,
    isActive: boolean,
    updatedAt: Date
  ) {
    this.title = title;
    this.description = description;
    this.fileType = fileType;
    this.fileName = fileName;
    this.accessControl = accessControl;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
  }
}
