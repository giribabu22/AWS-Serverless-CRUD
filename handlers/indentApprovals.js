// handlers/indentApprovals.js

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.createApproval = async (event) => {
  try {
    const { indent_id, approver_id, remarks, status } = JSON.parse(event.body);

    const params = {
      TableName: 'IndentApprovals',
      Item: {
        approval_id: uuidv4(),
        indent_id,
        approver_id,
        remarks,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Approval created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.listApprovals = async () => {
  try {
    const params = {
      TableName: 'IndentApprovals',
    };
    const result = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.getApproval = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'IndentApprovals',
      Key: {
        approval_id: id,
      },
    };
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Approval not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Implement updateApproval and deleteApproval similarly
