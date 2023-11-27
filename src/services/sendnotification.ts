import { getMessaging, Message } from "firebase-admin/messaging";

const sendToPushNoti = async (token: string, temp: number, hum: number): Promise<boolean> => {
  let res: boolean = false;
  const message: Message = {
    notification: {
      title: "แจ้งเตือน",
      body: 'อุณหภูมิสูงเกินกำหนด',
    },
    data: {
      temp: String(temp),
      hum: String(hum)
    },
    android: {
      notification: {
        sound: 'default',
        priority: 'max'
      },
      priority: 'high'
    },
    token: token
  };
  await getMessaging().send(message)
    .then((response) => {
      res = true;
    }).catch((error) => {
      console.log(error);
      res = false;
    })

  return res ? true : false;
}

export { sendToPushNoti };