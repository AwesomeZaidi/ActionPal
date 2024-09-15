// packages/api/modules/cta/procedures/get-cta-by-id.ts
import { db } from 'database';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc/base';

export const getCtaById = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    const cta = await db.cTA.findUnique({ where: { id: input } });
    return cta;
  });
