import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersPhonenumbersTable,
        Key: {
            clientId: content.clientId,
            phonenumberId: content.phonenumberId
        },
        UpdateExpression: `
            SET phoneType = :phoneType,
                countryCode = :countryCode,
                phonenumber = :phonenumber`,
        ExpressionAttributeValues: {
            ":phoneType": content.phoneType,
            ":countryCode": content.countryCode,
            ":phonenumber": content.phonenumber
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