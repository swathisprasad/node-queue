const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection) {
  if (error) {
    throw error;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = 'node_queue';
    let msg = 'Test message';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log("Sent '%s'", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'node_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    
    console.log("Waiting for messages in %s", queue);
    channel.consume(queue, function(msg) {

      console.log("Received '%s'", msg.content.toString());

      setTimeout(function() {
        channel.ack(msg);
      }, 1000);
    });
  });
});