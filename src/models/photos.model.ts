import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";

@Table
export class ListingPhotos extends Model<ListingPhotos> {
  @PrimaryKey
  @Column
  public id!: string;

  @Column
  public listingId!: string;

  @Column
  public name!: string;

  @Column
  public isCover!: boolean;

  @Column
  public bucket!: string;

  @Column
  public region!: string;

  @Column
  public key!: string;

  @Column
  public type!: string;

  @Column
  public createdAt!: Date;

  @Column
  public updatedAt!: Date;
}
