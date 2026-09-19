"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import { validateAndExtractUser } from "@/lib/telegram/get-telegram-user";
import { TelegramAuthError } from "@/lib/telegram/errors";

export interface CheckoutInput {
  initData: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  checkoutId: string;
}

export type CheckoutResult =
  | {
      success: true;
      orderId: string;
      total: number;
      status: string;
      createdAt: string;
    }
  | { success: false; error: string };

export async function placeOrderAction(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  try {
    // Validate Telegram initData and get user ID
    if (!input.initData?.trim()) {
      return { success: false, error: "Missing Telegram initData" };
    }

    const user = await validateAndExtractUser(input.initData);
    if (!user) {
      return { success: false, error: "Invalid Telegram session" };
    }

    const telegramUserId = user.id;

    // Validate required fields
    if (!input.customerName?.trim()) {
      return { success: false, error: "Customer name is required" };
    }
    if (!input.phone?.trim()) {
      return { success: false, error: "Phone number is required" };
    }
    if (!input.deliveryAddress?.trim()) {
      return { success: false, error: "Delivery address is required" };
    }
    if (!input.checkoutId?.trim()) {
      return { success: false, error: "Checkout ID is required" };
    }

    // Call the atomic PostgreSQL function
    const supabase = createServiceRoleClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc(
      "create_order_from_cart",
      {
        p_telegram_user_id: telegramUserId,
        p_checkout_id: input.checkoutId,
        p_customer_name: input.customerName.trim(),
        p_phone: input.phone.trim(),
        p_delivery_address: input.deliveryAddress.trim(),
      },
    );

    if (error) {
      // Handle specific error cases
      if (error.message.includes("Duplicate checkout_id")) {
        return { success: false, error: "This order has already been placed" };
      }
      if (error.message.includes("Cart is empty")) {
        return { success: false, error: "Your cart is empty" };
      }
      if (error.message.includes("Insufficient stock")) {
        return { success: false, error: error.message };
      }
      if (
        error.message.includes("no longer exists") ||
        error.message.includes("no longer available")
      ) {
        return {
          success: false,
          error: "One or more products are no longer available",
        };
      }
      return { success: false, error: error.message };
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { success: false, error: "Order creation failed" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = (Array.isArray(data) ? data[0] : data) as any;
    return {
      success: true,
      orderId: order.order_id,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
    };
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return {
        success: false,
        error: "Open this app in Telegram to place an order",
      };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderConfirmation {
  id: string;
  checkoutId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export type GetOrderConfirmationResult =
  | { success: true; order: OrderConfirmation }
  | { success: false; error: string };

export async function getOrderConfirmationAction(
  initData: string,
  orderId: string,
): Promise<GetOrderConfirmationResult> {
  try {
    if (!initData?.trim()) {
      return { success: false, error: "Missing Telegram initData" };
    }

    const user = await validateAndExtractUser(initData);
    if (!user) {
      return { success: false, error: "Invalid Telegram session" };
    }

    const supabase = createServiceRoleClient();

    // Get order with items, ensuring it belongs to the authenticated user
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        checkout_id,
        customer_name,
        phone,
        delivery_address,
        total,
        status,
        created_at,
        order_items (
          id,
          product_id,
          product_name,
          price,
          quantity
        )
      `,
      )
      .eq("id", orderId)
      .eq("telegram_user_id", user.id)
      .single();

    if (error || !order) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      order: {
        id: order.id,
        checkoutId: order.checkout_id,
        customerName: order.customer_name,
        phone: order.phone,
        deliveryAddress: order.delivery_address,
        total: order.total,
        status: order.status,
        createdAt: order.created_at,
        items: (order.order_items ?? []).map((item) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    };
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return {
        success: false,
        error: "Open this app in Telegram to view order",
      };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
