import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersAddressTable,
        Key: {
            clientId: content.clientId,
            addressId: content.addressId
        },
        UpdateExpression: `
            SET addressType = :addressType,
                country = :country,
                line1 = :line1,
                line2 = :line2,
                city = :city,
                state = :state
                zipCode = :zipCode,
                zipCodeAppend = :zipCodeAppend,
                modifiedAt = :modified`,
        ExpressionAttributeValues: {
            ":addressType": content.addressType,
            ":country": content.country,
            ":line1": content.line1,
            ":line2": content.line2 || null,
            ":city": content.city,
            ":state": content.state,
            ":zipCode": content.zipCode,
            ":zipCodeAppend": content.zipCodeAppend || null,
            ":modified": Date.now()
        },
        ReturnValue: "ALL_NEW"
    }

    try {
        await dynamodbLib.call('update', params)
        return success({ status: true })
    } catch (e) {
        return failure({ success: false })
    }
}