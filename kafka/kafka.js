import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.clientId,
      brokers: JSON.parse(process.env.brokers),
      ssl: {
        ca: [fs.readFileSync(path.resolve(process.env.sslPath), "utf-8")],
      },
      sasl: JSON.parse(process.env.sasl),
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: process.env.cosumer_gId });
  }

  async produce(topic, messages) {
    try {
      const result = await this.producer.connect();
      console.log("kafka connected... : ", result);
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic, callback) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default KafkaConfig;
