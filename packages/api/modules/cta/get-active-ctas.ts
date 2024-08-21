import { z } from 'zod';
import { db } from 'database';
import { publicProcedure } from '../../trpc/base';

export const getActiveCTAs = publicProcedure
  .input(z.void())
  .query(async () => {
    const ctAs = await db.cTA.findMany({ where: { isActive: true } });
    return ctAs;
  });
