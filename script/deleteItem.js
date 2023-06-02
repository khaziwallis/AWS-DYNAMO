import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);

const deleteGivenItem = async (requestParams) => {
    const command = new DeleteItemCommand(requestParams);
    return client.send(command).then((response) => {
      return response;
    }, (error) => {
      return error;
    });
};

const deleteItem = async () => {
    const requestParam = {
        TableName: "Servers",
        Key: {
          'id': {
            'S': '1'
          },
          'price': {
            'N': '100'
          }
        },
        ReturnValues: 'ALL_OLD'
    };
    const result = await deleteGivenItem(requestParam);
    console.log(result);
};

deleteItem();