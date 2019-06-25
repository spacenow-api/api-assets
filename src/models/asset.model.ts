import { Table, Column, Model, CreatedAt, UpdatedAt, IsUUID, IsAlpha, PrimaryKey, AllowNull, Unique, Default, BeforeCreate, HasMany, ForeignKey } from 'sequelize-typescript';
import uuidV4 from 'uuid/v4'

@Table
export class Asset extends Model<Asset> {
 
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;
 
  @Column
  title!: string;

  @Column
  description!: string;

  @Column
  filename!: string;

  @Unique
  @Column
  accessUrl!: string;

  @Column
  attributes!: [string];

  @Default('public-read')
  @Column
  accessControl!: string;

  @Default(true)
  @Column
  isActive!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BeforeCreate
  static async generateId(instance: Asset) {
    instance.id = uuidV4();
  }

}