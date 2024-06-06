import { z } from "zod";

export const ZLogParam = z.object({ logId: z.string() });
export const ZQueryLog = z.object({
  devSerial: z.string().optional(),
  filter: z.string().optional()
}).optional();

export type TQueryLog = z.infer<typeof ZQueryLog>;