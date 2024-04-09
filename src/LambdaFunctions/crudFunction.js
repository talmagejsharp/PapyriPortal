const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient()
const dynamodbTableName = 'PapyriPortal'; //idk if this is right!
const healthPath = '/health';
const papyrusPath = '/papyrus';
const papyriPath = '/papyri';

exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true){
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'GET' && event.path === papyrusPath:
      response = await getPapyrus(event.queryStringParameters.papyrusId);
      break;
    case event.httpMethod === 'GET' && event.path === papyriPath:
      response = await getPapyri();
      break;
    case event.httpMethod === 'POST' && event.path === papyrusPath:
      response = await savePapyrus(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.path === papyrusPath:
      const requestBody = JSON.parse(event.body);
      response = await modifyPapyrus(requestBody.papyrusId, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.path === papyrusPath:
      response = await deletePapyrus(JSON.parse(event.body).papyrusId);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function getPapyrus(papyrusId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'papyrusId': parseInt(papyrusId)
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  });
}

async function getPapyri() {
  const params = {
    TableName: dynamodbTableName
  }
  const allPapyri = await scanDynamoRecords(params, []);
  const body = {
    papyri: allPapyri
  }
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  }
}

async function savePapyrus(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

async function modifyPapyrus(papyrusId, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'papyrusId': papyrusId
    },
    UpdateExpression: `set #updateKey = :value`,
    ExpressionAttributeNames: {
      '#updateKey': updateKey
    },
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}


async function deletePapyrus(papyrusId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'papyrusId': parseInt(papyrusId)
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}