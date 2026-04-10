import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { contactMessages, settings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const contactRouter = router({
  // Submit contact form
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        status: "new",
      });

      return { success: true, message: "Message sent successfully" };
    }),

  // Get all messages (admin only)
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) return [];

    const messages = await db.select().from(contactMessages);
    return messages || [];
  }),

  // Mark message as read (admin only)
  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.update(contactMessages).set({ status: "read" }).where(eq(contactMessages.id, input.id));

      return { success: true };
    }),
});

export const settingsRouter = router({
  // Get setting by key
  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db.select().from(settings).where(eq(settings.key, input.key)).limit(1);

      return result.length ? result[0] : null;
    }),

  // Get all settings
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allSettings = await db.select().from(settings);
    return allSettings || [];
  }),

  // Update setting (admin only)
  update: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if setting exists
      const existing = await db.select().from(settings).where(eq(settings.key, input.key)).limit(1);

      if (existing.length) {
        await db.update(settings).set({ value: input.value, description: input.description }).where(eq(settings.key, input.key));
      } else {
        await db.insert(settings).values({
          key: input.key,
          value: input.value,
          description: input.description,
        });
      }

      return { success: true };
    }),
});
