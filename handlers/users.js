// handlers/users.js

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
// const uuidv4 = require('uuid/v4'); // Import uuid/v4

module.exports.createUser = async (event) => {
  try {
    const { username, password, role, department, email, phone_number } = JSON.parse(event.body);

    const params = {
      TableName: 'Users',
      Item: {
        // user_id: uuidv4(),
        username,
        password: hashAndSalt(password), // Implement your own hash and salt function
        role,
        department,
        email,
        phone_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.listUsers = async () => {
  try {
    console.log('listUsers')
    const params = {
      TableName: 'Users',
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

module.exports.getUser = async (event) => {
  try {
    const userId = event.pathParameters.id;
    console.log('userId: ', userId)
    const params = {
      TableName: 'Users',
      Key: {
        user_id: userId,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
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

module.exports.updateUser = async (event) => {
  try {
    const userId = event.pathParameters.id;
    const { username, role, department, email, phone_number } = JSON.parse(event.body);

    const params = {
      TableName: 'Users',
      Key: {
        user_id: userId,
        
      },
      UpdateExpression: 'SET #username = :username, #role = :role, #department = :department, #email = :email, #phone_number = :phone_number, #updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#username': 'username',
        '#role': 'role',
        '#department': 'department',
        '#email': 'email',
        '#phone_number': 'phone_number',
        '#updated_at': 'updated_at',
      },
      ExpressionAttributeValues: {
        ':username': username,
        ':role': role,
        ':department': department,
        ':email': email,
        ':phone_number': phone_number,
        ':updated_at': new Date().toISOString(),
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

module.exports.deleteUser = async (event) => {
  try {
    const userId = event.pathParameters.id;

    const params = {
      TableName: 'Users',
      Key: {
        user_id: userId,
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
