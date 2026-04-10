import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { vehicles, vehicleImages, carts, orders, orderItems } from "../../drizzle/schema";
import { eq, like } from "drizzle-orm";
import { storagePut } from "../storage";

export const vehicleRouter = router({
  // List all vehicles with filtering
  list: publicProcedure
    .input(
      z.object({
        region: z.string().optional(),
        make: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select().from(vehicles).where(eq(vehicles.isActive, true));

      if (input.region) {
        query = query.where(like(vehicles.region, `%${input.region}%`));
      }
      if (input.make) {
        query = query.where(like(vehicles.make, `%${input.make}%`));
      }

      const result = await query.limit(input.limit).offset(input.offset);
      return result || [];
    }),

  // Get single vehicle with images
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, input.id)).limit(1);
      if (!vehicle.length) return null;

      const images = await db.select().from(vehicleImages).where(eq(vehicleImages.vehicleId, input.id));

      return {
        ...vehicle[0],
        images: images || [],
      };
    }),

  // Create vehicle (admin only)
  create: protectedProcedure
    .input(
      z.object({
        make: z.string().min(1),
        model: z.string().min(1),
        year: z.number().int(),
        price: z.number().positive(),
        region: z.string().min(1),
        color: z.string().optional(),
        mileage: z.number().optional(),
        condition: z.enum(["new", "excellent", "good", "fair", "poor"]),
        stock: z.number().int().default(1),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const sku = `JPN-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await db.insert(vehicles).values({
        ...input,
        sku,
        price: input.price.toString(),
        importedFrom: "japan",
        features: input.features ? JSON.stringify(input.features) : null,
      });

      return { success: true, sku };
    }),

  // Update vehicle (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        price: z.number().optional(),
        stock: z.number().optional(),
        condition: z.enum(["new", "excellent", "good", "fair", "poor"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const { id, price, ...updateData } = input;
      const updateValues: any = { ...updateData };
      if (price !== undefined) {
        updateValues.price = price.toString();
      }
      await db.update(vehicles).set(updateValues).where(eq(vehicles.id, id));

      return { success: true };
    }),

  // Delete vehicle (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.update(vehicles).set({ isActive: false }).where(eq(vehicles.id, input.id));

      return { success: true };
    }),

  // Upload vehicle image
  uploadImage: protectedProcedure
    .input(
      z.object({
        vehicleId: z.number(),
        imageBuffer: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const buffer = Buffer.from(input.imageBuffer, "base64");
      const s3Key = `vehicles/${input.vehicleId}/${Date.now()}-${input.fileName}`;

      const { url } = await storagePut(s3Key, buffer, "image/jpeg");

      await db.insert(vehicleImages).values({
        vehicleId: input.vehicleId,
        imageUrl: url,
        s3Key,
        isPrimary: false,
      });

      return { success: true, url };
    }),
});

export const cartRouter = router({
  // Add to cart
  add: protectedProcedure
    .input(
      z.object({
        vehicleId: z.number(),
        quantity: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.insert(carts).values({
        userId: ctx.user!.id,
        vehicleId: input.vehicleId,
        quantity: input.quantity,
      });

      return { success: true };
    }),

  // Get cart
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const cartItems = await db.select().from(carts).where(eq(carts.userId, ctx.user!.id));
    return cartItems || [];
  }),

  // Remove from cart
  remove: protectedProcedure
    .input(z.object({ cartId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.delete(carts).where(eq(carts.id, input.cartId));

      return { success: true };
    }),
});

export const orderRouter = router({
  // Create order
  create: protectedProcedure
    .input(
      z.object({
        shippingAddress: z.string(),
        paymentMethod: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const cartItems = await db.select().from(carts).where(eq(carts.userId, ctx.user!.id));

      if (!cartItems.length) {
        throw new Error("Cart is empty");
      }

      let totalAmount = 0;
      for (const item of cartItems) {
        const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, item.vehicleId)).limit(1);
        if (vehicle.length) {
          totalAmount += Number(vehicle[0]!.price) * item.quantity;
        }
      }

      const orderNumber = `ORD-${Date.now()}`;
      await db.insert(orders).values({
        userId: ctx.user!.id,
        orderNumber,
        totalAmount: totalAmount.toString() as any,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        status: "pending",
        paymentStatus: "pending",
      });

      const createdOrder = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);

      for (const item of cartItems) {
        const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, item.vehicleId)).limit(1);
        if (vehicle.length && createdOrder.length) {
          await db.insert(orderItems).values({
            orderId: createdOrder[0]!.id,
            vehicleId: item.vehicleId,
            quantity: item.quantity,
            priceAtPurchase: vehicle[0]!.price,
          });
        }
      }

      await db.delete(carts).where(eq(carts.userId, ctx.user!.id));

      return { success: true, orderNumber, orderId: createdOrder.length ? createdOrder[0]!.id : 0 };
    }),

  // Get orders
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userOrders = await db.select().from(orders).where(eq(orders.userId, ctx.user!.id));
    return userOrders || [];
  }),
});
