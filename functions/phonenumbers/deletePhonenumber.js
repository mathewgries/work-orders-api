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
        }
    }

    try {
        await dynamodbLib.call("delete", params)
        return success({ status: true })
    } catch (e) {
        return failure({ status: false })
    }
}