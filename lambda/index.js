import { DynamoDBClient, GetItemCommand, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

import {
  BatchExecuteStatementCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

const config = {
  region: "us-west-2"
};
const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client);

const dynamodbTableName = 'product-inventory';
const healthPath = '/health';
const productPath = '/product';
const productsPath = '/products';

export const handler = async(event) => {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'GET' && event.path === productPath: {
      const requestParam = {
        TableName: dynamodbTableName,
        Key: {
          productid: {
            'S': event.queryStringParameters.productid
          }
        }
      };
      response = await getProduct(requestParam);
      break;
    }
    case event.httpMethod === 'GET' && event.path === productsPath:
      response = await getProducts();
      break;
    case event.httpMethod === 'DELETE' && event.path === productsPath:
      response = await deleteAllProducts();
      break;
    case event.httpMethod === 'POST' && event.path === productPath: {
      const requestBody = JSON.parse(event.body);
      response = await saveProduct(requestBody);
      break;
    }
    case event.httpMethod === 'PATCH' && event.path === productPath: {
      const requestBody = JSON.parse(event.body);
      response = await modifyProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
      break;
    }
    case event.httpMethod === 'DELETE' && event.path === productPath: {
      const requestBody = JSON.parse(event.body);
      response = await deleteProduct(requestBody.productId);
      break;
    }
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
};

const getProduct = async (requestParams) => {
  console.log('requestParams: ', JSON.stringify(requestParams));
  
  const command = new GetItemCommand(requestParams);
  return client.send(command).then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    return buildResponse(503, error);
  });
}

const deleteAllProducts = async () => {
  const params = {
    TableName: dynamodbTableName
  };
  const allProducts = await scanDynamoRecords(params, []);
  
  const productList = allProducts.map((item) => {
    return item.productid['S'];
  });
  
  const response = await deleteProducts(productList);
  
  const body = {
    products: allProducts,
    productList: productList,
    count: allProducts.length,
    response: response
  };
  
  return buildResponse(200, body);
}

const getProducts = async () => {
  const params = {
    TableName: dynamodbTableName
  }
  const allProducts = await scanDynamoRecords(params, []);
  const body = {
    products: allProducts,
    count: allProducts.length
  };
  
  return buildResponse(200, body);
}

const scanDynamoRecords = async (scanParams, itemArray) => {
  try {
    
    const command = new ScanCommand(scanParams);
    const dynamoData = await client.send(command);
    
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  }
}

const saveProduct = async (requestBody) => {
  const params = {
    TableName: dynamodbTableName,
    Item: {
      productid: {
        'S': requestBody.productId
      },
      price: {
        'S': requestBody.price
      }
    },
    ReturnConsumedCapacity: "TOTAL"
  };
  const command = new PutItemCommand(params);
  
  return client.send(command).then((response) => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody,
      reference: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do Error: ', error);
    return buildResponse(503, error);
  });
}

const modifyProduct = async (productId, updateKey, updateValue) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      productid: {
        'S': productId
      }
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  };
  const command = new UpdateItemCommand(params);
  
  return client.send(command).then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do Error: ', error);
    return buildResponse(503, error);
  });
}

const deleteProducts = async (productIdList) => {
  
  const command = new BatchExecuteStatementCommand({
    Statements: productIdList.map((item) => (
      {
        Statement: "DELETE FROM \"product-inventory\" WHERE productid=?",
        Parameters: [item]
      }
    ))
  });
  const response = await docClient.send(command);
  
  const body = {
    Operation: 'SELECT',
    Message: 'SUCCESS',
    Item: response
  };
  return buildResponse(200, body);
};

const deleteProduct = async (productId) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productid': {
        'S': productId
      }
    },
    ReturnValues: 'ALL_OLD'
  };
  const command = new DeleteItemCommand(params);
  return await client.send(command).then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  });
}

const buildResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}
