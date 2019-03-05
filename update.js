import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'workorderId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      workorderId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET title = :title, client = :client, contact = :contact, description = :description, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":title": data.title || null,
      ":client": data.clietn || null,
      ":contact": data.contact || null,
      ":description": data.description || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    console.log('Result: ', result)
    return success({ status: true });
  } catch (e) {
    console.log('Error: ', e.message)
    return failure({ status: false });
  }
}