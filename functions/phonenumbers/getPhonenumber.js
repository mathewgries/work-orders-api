import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, body) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersPhonenumbersTable,
        Key: {
            clientId: content.clientId,
            phonenumberId: content.phonenumberId
        }
    }

    try {
        const result = await dynamodbLib.call("get", params)
        if (result.Item) {
            return success(result.Item)
        } else {
            return failure({ status: false, error: 'Phone number not found' })
        }
    } catch (e) {
        return failure({ status: false })
    }
}