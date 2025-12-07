import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send receipt email to customer
 * @param {Object} receiptData - Receipt information
 * @param {string} customerEmail - Customer's email address
 */
export const sendReceiptEmail = async (receiptData, customerEmail) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Email configuration not set. Please configure SMTP settings.');
    }

    const transporter = createTransporter();

    const itemsList = receiptData.transaction.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
      </tr>`
    ).join('');

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Smart POS'}" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Receipt - ${receiptData.receiptNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border: 1px solid #ddd; border-top: none; }
            .receipt-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .receipt-header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 15px; margin-bottom: 20px; }
            .store-name { font-size: 24px; font-weight: bold; color: #2563EB; margin: 0; }
            .store-address { color: #666; margin: 5px 0; }
            .receipt-number { font-size: 18px; font-weight: bold; margin: 10px 0; }
            .receipt-date { color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #2563EB; }
            .total-row { font-size: 20px; font-weight: bold; color: #2563EB; text-align: right; padding-top: 15px; border-top: 2px solid #2563EB; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .thank-you { text-align: center; font-size: 18px; color: #2563EB; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🧾 Purchase Receipt</h1>
            </div>
            <div class="content">
              <div class="receipt-box">
                <div class="receipt-header">
                  <p class="store-name">${receiptData.storeName}</p>
                  <p class="store-address">${receiptData.storeAddress}</p>
                  <p class="receipt-number">Receipt: ${receiptData.receiptNumber}</p>
                  <p class="receipt-date">Date: ${new Date(receiptData.transaction.createdAt).toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}</p>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>

                <div class="total-row">
                  Total: ₹${receiptData.transaction.total.toFixed(2)}
                </div>
              </div>

              <p class="thank-you">Thank you for your purchase!</p>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                If you have any questions about this receipt, please contact us.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email from Smart POS System.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Receipt email sent to: ${customerEmail}`);
    return { success: true, message: 'Receipt sent successfully' };
  } catch (error) {
    console.error('Error sending receipt email:', error);
    throw new Error(`Failed to send receipt email: ${error.message}`);
  }
};

/**
 * Send low stock alert email to manager
 */
export const sendLowStockAlert = async (product, managerEmail) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration not set. Skipping low stock email notification.');
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Smart POS'}" <${process.env.SMTP_USER}>`,
      to: managerEmail,
      subject: `⚠️ Low Stock Alert: ${product.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .product-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .stock-critical { color: #d32f2f; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
            .btn { display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🛒 Smart POS - Low Stock Alert</h1>
            </div>
            <div class="content">
              <div class="alert-box">
                <h2 style="margin-top: 0; color: #856404;">⚠️ Action Required</h2>
                <p>The following product has fallen below its minimum stock threshold and needs to be reordered:</p>
              </div>
              
              <div class="product-details">
                <h3 style="margin-top: 0; color: #2563EB;">${product.name}</h3>
                <div class="detail-row">
                  <span class="detail-label">SKU:</span>
                  <span class="detail-value">${product.sku}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Supplier:</span>
                  <span class="detail-value">${product.supplier.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Current Stock:</span>
                  <span class="stock-critical">${product.stock} units</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Minimum Threshold:</span>
                  <span class="detail-value">${product.lowStockThreshold} units</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Unit Cost:</span>
                  <span class="detail-value">₹${product.cost.toFixed(2)}</span>
                </div>
              </div>

              <p><strong>Recommended Action:</strong> Please log in to the Smart POS system and create a reorder for this product to avoid stockouts.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/manager" class="btn">
                  Go to Inventory Panel
                </a>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>Supplier Contact:</strong><br>
                Email: ${product.supplier.email}<br>
                Phone: ${product.supplier.phone}
              </p>
            </div>
            <div class="footer">
              <p>This is an automated notification from Smart POS Inventory Management System.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low stock alert email sent for product: ${product.name}`);
  } catch (error) {
    console.error('Error sending low stock alert email:', error);
  }
};

/**
 * Send order approval notification to supplier
 */
export const sendOrderApprovalNotification = async (order, managerEmail) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration not set. Skipping order approval email notification.');
      return;
    }

    const transporter = createTransporter();

    const itemsList = order.items.map(item => 
      `<li>${item.product.name} - Quantity: ${item.quantity} @ ₹${item.unitPrice.toFixed(2)} = ₹${item.subtotal.toFixed(2)}</li>`
    ).join('');

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Smart POS'}" <${process.env.SMTP_USER}>`,
      to: order.supplier.email,
      cc: managerEmail,
      subject: `Purchase Order #${order.id} - ${order.supplier.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            .order-box { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
            .total { font-size: 20px; font-weight: bold; color: #2563EB; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #2563EB; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📦 Purchase Order</h1>
              <p style="margin: 5px 0 0 0;">Order #${order.id}</p>
            </div>
            <div class="content">
              <p>Dear ${order.supplier.name},</p>
              <p>Please find our purchase order details below:</p>
              
              <div class="order-box">
                <h3 style="margin-top: 0;">Order Items:</h3>
                <ul style="list-style: none; padding: 0;">
                  ${itemsList}
                </ul>
                <div class="total">
                  Total: ₹${order.total.toFixed(2)}
                </div>
              </div>

              <p><strong>Delivery Instructions:</strong> Please confirm receipt of this order and provide an estimated delivery date.</p>
              
              <p>If you have any questions, please contact us at your earliest convenience.</p>
              
              <p>Best regards,<br>
              Smart POS Inventory Management</p>
            </div>
            <div class="footer">
              <p>This is an automated email from Smart POS System.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order approval email sent for order #${order.id}`);
  } catch (error) {
    console.error('Error sending order approval email:', error);
  }
};
