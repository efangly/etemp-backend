import { connect, IClientOptions, MqttClient } from "mqtt";
import dotenv from "dotenv";
import { sendToPushNoti } from "../services/sendnotification";
dotenv.config();

let client: MqttClient;
const options: IClientOptions = {
  host: process.env.MQTT_SERVER,
  port: Number(process.env.MQTT_PORT),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  clientId: "mqtt_dev_fangly"
}

const connectMqtt = () => {
  client = connect(options);
  client.on('connect', () => {
    console.log("MQTT Connect");
    client.subscribe('test/msg', (err) => {
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
      let value: { temp: number, hum: number } = JSON.parse(message.toString());
      sendToPushNoti('fdjiQi3cTAKEVyHgmUa8EC:APA91bECUOnV6IWeIpMXEjd2iGd-UFUx6kfzLTuzMzb_sLirqinzg_p5HjFRJdDVyIWA7zw-t4tcjew1lMVPFrHGpOe5s77rw6OAaZv2cBs9HlIC5Z90Zz7bIy-S5i2KVVs09OdvWOy_',value.temp,value.hum);
      console.log(value);
    });
  });
}

export { client, connectMqtt };