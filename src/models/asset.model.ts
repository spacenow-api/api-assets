import {
  attribute,
  autoGeneratedHashKey,
  table
} from "@aws/dynamodb-data-mapper-annotations";

@table("Assets")
export class Asset {
  @autoGeneratedHashKey()
  public id!: string;

  @attribute()
  public title!: string;

  @attribute()
  public description!: string;

  @attribute()
  public fileType!: string;

  @attribute()
  public fileName!: string;

  @attribute()
  public sizes!: Object;

  @attribute()
  public accessControl!: string;

  @attribute()
  public isActive!: boolean;

  @attribute()
  public createdAt!: Date;

  @attribute()
  public updatedAt!: Date;
}
