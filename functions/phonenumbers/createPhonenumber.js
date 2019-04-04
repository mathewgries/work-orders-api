import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersPhonenumbersTable,
        Item: {
            phonenumberId: content.phonenumberId,
            userId: event.requestContext.identity.cognitoIdentityId,
            clientId: content.clientId,
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
