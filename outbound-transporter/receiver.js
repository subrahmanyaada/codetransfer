const Consume = require("./partner/clevertap/consumer");
const consume = new Consume();

async function listen() {

  // const configData = stringifyObject({
  //   "consumerId": "bmp",
  //   "partnerId": "ctap",
  //   "rabbitMQ": {
  //     "url": "amqp://rabbitmq:5672"
  //   },
  //   "ctap": {
  //     "success": "https://cb.wzrkt.com/generic/response?a=",
  //     "delivered": "https://cb.wzrkt.com/generic/response?a=",
  //     "failed": "https://cb.wzrkt.com/generic/response?a=",
  //     "im-text": "https://sk1-staging-9.wzrkt.com/wa/generic/response?a=",
  //     "read": "https://cb.wzrkt.com/generic/response?a="
  //   },
  //   "bmp": {
  //     "eventTypeMessageStatusKey": "MessageStatus",
  //     "eventTypeMessageKey": "Message",
  //     "eventTypeConversationKey": "Conversation"
  //   },
  //   "redis": {
  //     "host": "redis",
  //     "port": 6379
  //   },
  //   "ctapConsumeQ": {
  //     "exchangeName": "outCollectorEx",
  //     "qName": "bmpctapOutCollectorQ",
  //     "routingKey": "bmpctapOutCollect"
  //   },
  //   "dispatchQ": {
  //     "exchangeName": "outDispatcherEx",
  //     "qName": "bmpctapOutDispatcherQ",
  //     "routingKey": "bmpctapOutDispatch"
  //   },
  //   "env_prod" : true,
  //   "env_dev" : true
  // }
  // )


  await consume.consumeMethod()
}

listen()

