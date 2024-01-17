import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getHospitalImage } from "../services/image";
import { group, hospitals } from "@prisma/client";

const getHospital = async (req: Request, res: Response) => {
  await prisma.hospitals.findMany({}).then((result) => {
    res.json({ status: 200, value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const getHospitalById = async (req: Request, res: Response) => {
  const { hos_id } = req.params;
  await prisma.hospitals.findUnique({
    where: {
      hos_id: hos_id
    }
  }).then((result) => {
    if (result) {
      res.status(200).json({ status: 200, value: result });
    } else {
      res.status(404).json({ status: 404, value: 'ไม่พบข้อมูล' });
    }
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const createHospital = async (req: Request, res: Response) => {
  const params: hospitals = req.body;
  params.hos_id = `HOS-${uuidv4()}`;
  params.hos_picture = req.file === undefined ? null : `/img/hospital/${req.file?.filename}`;
  await prisma.hospitals.create({
    data: params
  }).then((result) => {
    res.status(201).json({ status: 201, msg: "Create Suscess!!", data : result });
  }).catch((err) => {
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/hospital', String(req.file?.filename)));
    res.status(400).json({ error: err });
  });
};

const updateHospital = async (req: Request, res: Response) => {
  const params: hospitals = req.body;
  const { hos_id } = req.params;
  const file: string | undefined = req.file?.filename;
  try {
    const filename = await getHospitalImage(hos_id);
    params.hos_picture = req.file === undefined ? filename || null : `/img/hospital/${file}`
    const result: hospitals = await prisma.hospitals.update({
      where: {
        hos_id: hos_id
      },
      data: params
    })
    if (req.file !== undefined && !!filename) {
      fs.unlinkSync(path.join('public/images/hospital', String(filename?.split("/")[3])));
    }
    res.json({ status: 200, msg: 'Update Successful!!', value: result });
  } catch (err) {
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/hospital', String(file)));
    res.status(400).json({ error: err });
  }
}

const deleteHospital = async (req: Request, res: Response) => {
  const { hos_id } = req.params;
  try {
    const filename = await getHospitalImage(hos_id);
    await prisma.hospitals.delete({ where: { hos_id: hos_id } })
    if (!!filename) fs.unlinkSync(path.join('public/images/hospital', String(filename?.split("/")[3])));
    res.json({ status: 200, msg: 'Delete Successful!!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

/////////////////////////////////////////////////////////////////// WARD //////////////////////////////////////////////////////////////////////////////////

const getGroup = async (req: Request, res: Response) => {
  await prisma.group.findMany({
    include: {
      hospital: true
    }
  }).then((result) => {
    res.json({ status: 200, value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const getGroupById = async (req: Request, res: Response) => {
  const { group_id } = req.params;
  await prisma.group.findUnique({
    where: {
      group_id: group_id
    },
    include: {
      hospital: true
    }
  }).then((result) => {
    res.json({ status: 200, value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const getGroupByHosId = async (req: Request, res: Response) => {
  const { hos_id } = req.params;
  await prisma.group.findMany({
    where: {
      hos_id: hos_id
    },
    include: {
      hospital: true
    }
  }).then((result) => {
    res.json({ status: 200, value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const createGroup = async (req: Request, res: Response) => {
  const param: group = req.body;
  const value: group = {
    group_id: `WID-${uuidv4()}`,
    group_name: param.group_name,
    hos_id: param.hos_id
  };
  await prisma.group.create({
    data: value,
    include: {
      hospital: true
    }
  }).then((result) => {
    res.status(201).json({ status: 201, msg: 'Create Successful!!', value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const updateGroup = async (req: Request, res: Response) => {
  const { group_id } = req.params;
  const param: group = req.body;
  await prisma.group.update({
    where: {
      group_id: group_id
    },
    data: param
  }).then((result) => {
    res.json({ status: 200, msg: 'Update Successful!!', value: result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const deleteGroup = async (req: Request, res: Response) => {
  const { group_id } = req.params;
  await prisma.group.delete({
    where: {
      group_id: group_id
    }
  }).then((result) => {
    res.json({ status: 200, msg: 'Delete Successful!!' });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

export default {
  getHospital,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  getGroup,
  getGroupById,
  getGroupByHosId,
  createGroup,
  updateGroup,
  deleteGroup
};