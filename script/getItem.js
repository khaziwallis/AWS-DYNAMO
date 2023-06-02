import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);

const getItem = async (requestParams) => {
    const command = new GetItemCommand(requestParams);
    return client.send(command).then((response) => {
      return response.Item;
    }, (error) => {
      return error;
    });
};

const readItem = async () => {
    const requestParam = {
        TableName: "Servers",
        Key: {
          id: {
            'S': '1'
          },
          price: {
            'N': '100'
          }
        }
    };
    const result = await getItem(requestParam);
    console.log(result);
};

readItem();