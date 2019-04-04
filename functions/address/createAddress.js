import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersAddressTable,
        Item: {
            addressId: content.addressId,
            userId: event.requestContext.identity.cognitoIdentityId,
            clientId: content.clientId,
            addressType: content.addressType, // Mailing or Billing
            country: content.country,
            line1: content.line1,
            line2: content.line2,
            city: content.city,
            state: content.state,
            zipCode: content.zipCode,
            zipCode4: content.zipCodeAppend || null,
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
