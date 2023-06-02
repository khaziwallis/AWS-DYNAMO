import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const scanTable = async (TABLE_NAME) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const response = await docClient.send(command);
  return response;
};

const deleteAll = async (idList, TABLE_NAME) => {
    const command = new BatchExecuteStatementCommand({
      Statements: idList.map((item) => {
        return (
          {
            Statement: `DELETE FROM \"${TABLE_NAME}\" WHERE id=?`,
            Parameters: [item]
          }
        )
      })
    });
    const response = await docClient.send(command);
    return response;
};

const deleteAllDynamoTable = async (TABLE_NAME) => {
  const result = await scanTable(TABLE_NAME);
  const idList = result.Items.map((item) => item.id);
  let total = 0;
  let results = [];
  while(total <= idList.length) {
    let newTotal = total + 25;
    const dataToProcess = idList.slice(total, newTotal - 1);
    const result = await deleteAll(dataToProcess, TABLE_NAME);
    results.push(result);
    total = newTotal;
    if (total >= idList.length) {
      break;
    }
  }
  console.log('results', results);
};

deleteAllDynamoTable("Servers");
