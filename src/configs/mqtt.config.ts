import { connect, IClientOptions, MqttClient } from "mqtt";
import { ReceiveMsg } from "../interfaces/notification.interface";
import { createNotification } from "../services/notification";
import dotenv from "dotenv";

dotenv.config();

let client: MqttClient;
const options: IClientOptions = {
  host: process.env.MQTT_SERVER,
  port: Number(process.env.MQTT_PORT),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  clientId: "mqtt_dev_fanglyy"
}

const connectMqtt = () => {
  client = connect(options);
  client.on('connect', () => {
    console.log("MQTT Connect");
    client.subscribe(['psu/noti','testtopic'], (err) => {
      if(err){
        console.log(err);
      }
    });

    client.on("error", (err) => {
      console.log("Error: ", err);
      client.end();
    });
  
    client.on("reconnect", () => {
      console.log("Reconnecting...");
    });

    client.on('message', (topic, message) => {
      console.log(topic);
      let value: ReceiveMsg = JSON.parse(message.toString());
      createNotification(value);
      console.log(value);
    });
  });
}

export { client, connectMqtt };