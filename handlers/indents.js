// handlers/indents.js

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4'); // Import uuid/v4
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.createIndent = async (event) => {
  try {
    const { user_id, item_type, description, quantity, status } = JSON.parse(event.body);

    const params = {
      TableName: 'Indents',
      Item: {
        indent_id: uuidv4(),
        user_id,
        item_type,
        description,
        quantity,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Indent created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.listIndents = async () => {
  try {
    const params = {
      TableName: 'Indents',
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

module.exports.getIndent = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'Indents',
      Key: {
        indent_id: id,
      },
    };
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Indent not found' }),
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

module.exports.updateIndent = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { item_type, description, quantity, status } = JSON.parse(event.body);

    const params = {
      TableName: 'Indents',
      Key: {
        indent_id: id,
      },
      UpdateExpression: 'set item_type = :item_type, description = :description, quantity = :quantity, #st = :status, updated_at = :updated_at',
      ExpressionAttributeValues: {
        ':item_type': item_type,
        ':description': description,
        ':quantity': quantity,
        ':status': status,
        ':updated_at': new Date().toISOString(),
      },
      ExpressionAttributeNames: {
        '#st': 'status',
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.deleteIndent = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'Indents',
      Key: {
        indent_id: id,
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Indent deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
