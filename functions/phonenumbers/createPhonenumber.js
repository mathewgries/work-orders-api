import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'
import uuid from 'uuid'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersPhonenumbersTable,
        Item: {
            phonenumberId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            relationId: content.relationId,
            relationType: content.relationType, // 1. Client, 2. Contact
            phoneType: content.phoneType,
            phonenumber: content.phonenumber,
            countryCode: content.countryCode,
            createdAt: Date.now(),
            modifiedAt: null
        }
    }

    try {
        await dynamodbLib.call("put", params)
        return success(params.Item)
    } catch (e) {
        return failure({ status: false })
    }
}
