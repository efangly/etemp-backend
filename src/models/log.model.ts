import { z } from "zod";

export const ZLogParam = z.object({ logId: z.string() });
export const ZQueryLog = z.object({
  devSerial: z.string(),
  filter: z.string().optional(),
  type: z.string().optional()
});

export type TQueryLog = z.infer<typeof ZQueryLog>;