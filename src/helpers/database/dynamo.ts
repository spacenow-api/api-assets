import DynamoDB from "aws-sdk/clients/dynamodb";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import Asset from "../../models";

let dynamoDB: DataMapper;

const initialize = () => {
  if (!dynamoDB) {
    dynamoDB = new DataMapper({
      client: new DynamoDB({
        apiVersion: "2012-08-10",
        endpoint: "http://localhost:8000"
      })
    });
    dynamoDB.ensureTableExists(Asset, {
      readCapacityUnits: 1,
      writeCapacityUnits: 1
    });
  }
};

export { initialize as default, dynamoDB };
