import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    BatchExecuteStatementCommand,
} from "@aws-sdk/lib-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client);

const writeItems = async (list) => {
    const command = new BatchExecuteStatementCommand({
        Statements: list.map((item) => ({
          Statement: `INSERT INTO \"Servers\" value {'id':?, 'price':?}`,
          Parameters: [item.id, item.price],
        })),
    });
    const response = await docClient.send(command);
    return response;
};

const addItems = async () => {
    const list = [{
        id: '30',
        price: 300
    }, {
        id: '31',
        price: 3100
    }];
    const result = await writeItems(list);
    console.log(result.Responses);
};

addItems();