const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  for (const record of event.Records) {
    // Only proceed if the record is an INSERT event
    if (record.eventName === 'INSERT') {
      // Extract the new image (the inserted item)
      const newItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
      
      // Construct a message with the item details
      const message = `A new item was uploaded to the DynamoDB table:\n${JSON.stringify(newItem, null, 2)}`;
      
      // Define SNS publish parameters
      const params = {
        Message: message,
        TopicArn: 'arn:aws:sns:region:account-id:topic-name', // Replace with your SNS topic ARN
        Subject: 'New DynamoDB Table Entry' // You can also set a subject for email notifications
      };

      // Attempt to publish the message to the SNS topic
      try {
        const publishResult = await sns.publish(params).promise();
        console.log(`Message sent to SNS topic. Message ID: ${publishResult.MessageId}`);
      } catch (error) {
        console.error(`Error sending message to SNS topic: ${error.message}`);
      }
    }
  }
};
