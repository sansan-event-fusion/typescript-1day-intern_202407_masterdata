import { z } from 'zod';

export type SOC = z.infer<typeof SOC>;
export type SLC = z.infer<typeof SLC>;

export const SOC = z.string().length(13);
export const SLC = z.string().length(13);
