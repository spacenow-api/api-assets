import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  IsAlpha,
  PrimaryKey,
  AllowNull,
  Unique,
  Default
} from "sequelize-typescript";

@Table
export class ListingAssets extends Model<ListingAssets> {
  @PrimaryKey
  @Unique
  @Column
  public assetId!: string;

  @PrimaryKey
  @Column
  public listingId!: number;

  @Default(0)
  @Column
  public isCover!: boolean;

  @Column
  public createdAt!: Date;

  @Column
  public updatedAt!: Date;
}
