// Receipt Generator Utility for KODEON IDE

class ReceiptGenerator {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;
        console.log("Receipt generator initialized");
    }

    generateReceipt(transactionData) {
        if (!this.isInitialized) {
            throw new Error("Receipt generator not initialized");
        }

        const {
            transactionId,
            amount,
            planName,
            userEmail,
            paymentMethod,
            timestamp,
            couponCode,
            discountAmount,
        } = transactionData;

        // Format timestamp
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Create receipt content
        const receipt = `
KODEON IDE - Subscription Receipt
=================================

Transaction ID: ${transactionId}
Date: ${formattedDate}

Billed To: ${userEmail}

Subscription Plan: ${planName}

Payment Method: ${paymentMethod}

Order Summary:
  ${planName}: $${amount.toFixed(2)}
  ${couponCode ? `Coupon (${couponCode}): -$${discountAmount.toFixed(2)}` : ""}
  -------------------
  Total: $${(amount - (discountAmount || 0)).toFixed(2)}

Thank you for your subscription to KODEON IDE!

If you have any questions about this receipt, please contact our support team.

© ${new Date().getFullYear()} KODEON. All rights reserved.
        `.trim();

        return receipt;
    }

    async saveReceipt(receiptContent, filename) {
        if (!this.isInitialized) {
            throw new Error("Receipt generator not initialized");
        }

        try {
            // In a real implementation, this would save the receipt to a file or send it via email
            console.log("Saving receipt:", filename);
            console.log(receiptContent);

            // For demonstration, we'll just return the filename
            return filename;
        } catch (error) {
            console.error("Error saving receipt:", error);
            throw error;
        }
    }

    async sendReceiptEmail(receiptContent, userEmail) {
        if (!this.isInitialized) {
            throw new Error("Receipt generator not initialized");
        }

        try {
            // In a real implementation, this would send the receipt via email
            console.log(`Sending receipt to ${userEmail}`);
            console.log(receiptContent);

            return true;
        } catch (error) {
            console.error("Error sending receipt email:", error);
            throw error;
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    }

    generateInvoiceNumber() {
        // Generate a simple invoice number
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");

        return `INV-${year}${month}${day}-${random}`;
    }
}

module.exports = new ReceiptGenerator();
