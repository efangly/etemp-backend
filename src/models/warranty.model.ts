import { z } from "zod";

export const ZWarrantyParam = z.object({ warrId: z.string() });
export const ZWarranty = z.object({
  warrId: z.string().optional(),
  devName: z.string().optional(),
  invoice: z.string().optional(),
  expire: z.string().optional(),
  warrStatus: z.boolean().optional(),
});