import { z } from "zod";

export const ZLogParam = z.object({ logId: z.string() });
export const ZQueryLog = z.object({
  devId: z.string(),
  filter: z.string()
}).optional();

export type TQueryLog = z.infer<typeof ZQueryLog>;