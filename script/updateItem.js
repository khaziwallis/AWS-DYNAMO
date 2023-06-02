import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);

const updateItem = async (requestParams) => {
    const command = new UpdateItemCommand(requestParams);
    return client.send(command).then((response) => {
      return response;
    }, (error) => {
      return error;
    });
};

const modifyItem = async () => {
    const updateKey = "age";
    const updateValue = "5000";
    const requestParam = {
        TableName: "Servers",
        Key: {
            id: {
              'S': '1'
            },
            price: {
              'N': '100'
            }
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
          ':value': {
            S: updateValue
          }
        },
        ReturnValues: 'UPDATED_NEW'
      };
    const result = await updateItem(requestParam);
    console.log(result);
};

modifyItem();