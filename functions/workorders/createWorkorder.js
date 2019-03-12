import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from 'uuid'

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const { content } = data

  const params = {
    TableName: process.env.workordersTable,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      workorderId: uuid.v1(),
      title: content.title,
      clientId: content.clientId,
      contactId: content.contactId,
      description: content.description,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
