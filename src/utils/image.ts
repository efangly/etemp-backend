import prisma from "../configs/prisma.config";

const getUserImage = async (id: string): Promise<string | null | undefined> => {
  try{
    const image = await prisma.users.findUnique({
      where: { 
        userId: id 
      }
    });
    return image?.userPic;
  }catch(err){
    throw new Error(`ERROR: ${err}`);
  }
}

const getHospitalImage = async (id: string): Promise<string | null | undefined> => {
  try{
    const image = await prisma.hospitals.findUnique({
      where: { 
        hosId: id 
      }
    });
    return image?.hosPic;
  }catch(err){
    throw new Error(`ERROR: ${err}`);
  }
}

const getDeviceImage = async (id: string): Promise<string | null | undefined> => {
  try{
    const image = await prisma.devices.findUnique({
      where: { 
        devId: id 
      }
    });
    return image?.locationPic;
  }catch(err){
    throw new Error(`ERROR: ${err}`);
  }
}

export {
  getUserImage,
  getHospitalImage,
  getDeviceImage
}

