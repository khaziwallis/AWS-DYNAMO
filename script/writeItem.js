import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);

const putItem = async (requestParams) => {
    const command = new PutItemCommand(requestParams);
    return client.send(command).then((response) => {
      return response;
    }, (error) => {
      return error;
    });
};

const writeItem = async () => {
    const requestParam = {
        TableName: "Servers",
        Item: {
          id: {
            'S': "1"
          },
          price: {
            'N': "10"
          },
          age: {
            'N': "10"
          }
        },
        ReturnConsumedCapacity: "TOTAL"
    };
    const result = await putItem(requestParam);
    console.log(result);
};

writeItem();