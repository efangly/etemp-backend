import prisma from "../configs/prisma.config";

const getUserImage = async (id: string): Promise<string | null | undefined> => {
  try{
    const image = await prisma.users.findUnique({
      where: { 
        user_id: id 
      }
    });
    return image?.user_picture;
  }catch(err){
    throw new Error(`ERROR: ${err}`);
  }
}

const getHospitalImage = async (id: string): Promise<string | null | undefined> => {
  try{
    const image = await prisma.hospitals.findUnique({
      where: { 
        hos_id: id 
      }
    });
    return image?.hos_picture;
  }catch(err){
    throw new Error(`ERROR: ${err}`);
  }
}

export {
  getUserImage,
  getHospitalImage
}

