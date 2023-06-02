import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    BatchExecuteStatementCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const config = {
    region: "us-west-2"
  };
const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client);
  
const updateItems = async (list) => {
    const command = new BatchExecuteStatementCommand({
        Statements: list.map((item) => ({
          Statement: `UPDATE \"Servers\" SET age=? where id=? AND price=?`,
          Parameters: [item.age, item.id, item.price],
        })),
    });
    const response = await docClient.send(command);
    return response;
};


const updateData = async () => {
    const list = [{
        id: '30',
        price: 300,
        age: '10'
    }, {
        id: '31',
        price: 3100,
        age: '0'
    }];
    const result = await updateItems(list);
    console.log(result.Responses);
};

updateData();