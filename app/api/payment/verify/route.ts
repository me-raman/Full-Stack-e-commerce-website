import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { transporter, getISTTime } from "@/lib/mailer";
import { BRAND_COLORS } from "@/lib/colors";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await req.json();

    // 1. Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 2. Save order to Supabase
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_charge: orderData.shipping_charge,
        total: orderData.total,
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        payment_status: "paid",
        order_status: "confirmed",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // 3. Send confirmation email
    try {
      const itemsHtml = orderData.items
        .map(
          (item: { product_name: string; size: string; color: string; quantity: number; price: number }) => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
              <strong>${item.product_name}</strong><br/>
              <span style="color: ${BRAND_COLORS.textSecondary}; font-size: 13px;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</span>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border}; text-align: right; font-weight: bold;">
              ₹${(item.price * item.quantity).toLocaleString("en-IN")}
            </td>
          </tr>`
        )
        .join("");

      const addr = orderData.shipping_address;

      await transporter.sendMail({
        from: `"Tilaak" <${process.env.GMAIL_USER}>`,
        to: orderData.customer_email,
        subject: `Order Confirmed! #${orderData.order_number} — Tilaak`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: 'Segoe UI', sans-serif; background: ${BRAND_COLORS.surface}; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
              <!-- Header -->
              <div style="background: ${BRAND_COLORS.primary}; padding: 32px; text-align: center;">
                <h1 style="color: ${BRAND_COLORS.gold}; font-size: 28px; margin: 0; font-family: Georgia, serif;">Tilaak</h1>
                <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Wear the Culture, Own the Story</p>
              </div>

              <div style="padding: 32px;">
                <!-- Greeting -->
                <h2 style="color: ${BRAND_COLORS.dark}; margin: 0 0 8px; font-family: Georgia, serif;">Order Confirmed! 🎉</h2>
                <p style="color: ${BRAND_COLORS.textSecondary}; margin: 0 0 24px; font-size: 15px;">
                  Hi ${orderData.customer_name}, thank you for shopping with Tilaak!
                </p>

                <!-- Order Info -->
                <div style="background: ${BRAND_COLORS.surface}; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textSecondary};">
                    <strong style="color: ${BRAND_COLORS.dark};">Order Number:</strong> #${orderData.order_number}<br/>
                    <strong style="color: ${BRAND_COLORS.dark};">Date:</strong> ${getISTTime()}<br/>
                    <strong style="color: ${BRAND_COLORS.dark};">Payment ID:</strong> ${razorpay_payment_id}
                  </p>
                </div>

                <!-- Items -->
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid ${BRAND_COLORS.border}; color: ${BRAND_COLORS.textSecondary}; font-size: 13px;">ITEMS</th>
                    <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid ${BRAND_COLORS.border}; color: ${BRAND_COLORS.textSecondary}; font-size: 13px;">AMOUNT</th>
                  </tr>
                  ${itemsHtml}
                  <tr>
                    <td style="padding: 8px 0; color: ${BRAND_COLORS.textSecondary};">Subtotal</td>
                    <td style="text-align: right;">₹${orderData.subtotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: ${BRAND_COLORS.textSecondary};">Shipping</td>
                    <td style="text-align: right;">${orderData.shipping_charge === 0 ? "FREE" : "₹" + orderData.shipping_charge}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-top: 2px solid ${BRAND_COLORS.dark}; font-weight: bold; font-size: 16px;">Total</td>
                    <td style="padding: 12px 0; border-top: 2px solid ${BRAND_COLORS.dark}; text-align: right; font-weight: bold; font-size: 16px; color: ${BRAND_COLORS.primary};">₹${orderData.total.toLocaleString("en-IN")}</td>
                  </tr>
                </table>

                <!-- Shipping Address -->
                <div style="margin-top: 24px; background: ${BRAND_COLORS.surface}; border-radius: 12px; padding: 16px;">
                  <h3 style="margin: 0 0 8px; font-size: 14px; color: ${BRAND_COLORS.dark};">Shipping To:</h3>
                  <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textSecondary}; line-height: 1.6;">
                    ${addr.full_name}<br/>
                    ${addr.address_line1}<br/>
                    ${addr.address_line2 ? addr.address_line2 + "<br/>" : ""}
                    ${addr.city}, ${addr.state} ${addr.pincode}<br/>
                    Phone: ${addr.phone}
                  </p>
                </div>

                <!-- Delivery -->
                <div style="margin-top: 24px; text-align: center; padding: 20px; background: #f0fdf4; border-radius: 12px;">
                  <p style="margin: 0; font-size: 15px; color: #166534; font-weight: 600;">
                    🚚 Expected Delivery: 5–7 Business Days
                  </p>
                </div>

                <!-- Support -->
                <div style="margin-top: 24px; text-align: center;">
                  <p style="color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">Need help with your order?</p>
                  <a href="https://wa.me/919820000000" style="display: inline-block; background: #25D366; color: white; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: ${BRAND_COLORS.primary}; padding: 20px; text-align: center;">
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
                  © 2025 Tilaak | Mumbai, India | hello@tilaak.in
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
