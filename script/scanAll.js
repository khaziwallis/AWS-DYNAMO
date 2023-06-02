import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const scanTable = async (TABLE_NAME) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME
  });
  const response = await docClient.send(command);
  return response;
};

const readDynamoTable = async (TABLE_NAME) => {
  const result = await scanTable(TABLE_NAME);
  console.log('results', result.Items);
};

readDynamoTable("Servers");
