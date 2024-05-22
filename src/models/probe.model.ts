import { z } from "zod";

export const ZProbeParam = z.object({ probeId: z.string() });
export const ZProbe = z.object({
  probeId: z.string().optional(),
  probeName: z.string().optional(),
  probeType: z.string().optional(),
  probCh: z.string().optional(),
  tempMin: z.number().optional(),
  tempMax: z.number().optional(),
  humMin: z.number().optional(),
  humMax: z.number().optional(),
  adjustTemp: z.number().optional(),
  adjustHum: z.number().optional(),
  delayTime: z.string().optional(),
  door: z.string().optional(),
  devId: z.string().optional()
});