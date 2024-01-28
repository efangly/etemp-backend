
export interface ReceiveMsg {
  device: string, 
  msg: string,
  temp: number, 
  hum: number
};

export interface Notification {
  noti_id: string,
  dev_id: string,
  noti_detail: string,
  noti_status: string,
}