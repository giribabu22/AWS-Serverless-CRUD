const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.addItemToStock = async (event) => {
  try {
    const { item_name, item_type, quantity_available, items_cost } = JSON.parse(event.body);

    const params = {
      TableName: 'Stock',
      Item: {
        item_id: uuidv4(),
        item_name,
        item_type,
        quantity_available,
        items_cost,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added to stock successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.listStockItems = async () => {
  try {
    const params = {
      TableName: 'Stock',
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

module.exports.getStockItem = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'Stock',
      Key: {
        item_id: id,
      },
    };
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
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

module.exports.updateStockItem = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { item_name, item_type, quantity_available, items_cost } = JSON.parse(event.body);

    const params = {
      TableName: 'Stock',
      Key: {
        item_id: id,
      },
      UpdateExpression: 'set item_name = :name, item_type = :type, quantity_available = :quantity, items_cost = :cost, updated_at = :updatedAt',
      ExpressionAttributeValues: {
        ':name': item_name,
        ':type': item_type,
        ':quantity': quantity_available,
        ':cost': items_cost,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
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

module.exports.deleteStockItem = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'Stock',
      Key: {
        item_id: id,
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
