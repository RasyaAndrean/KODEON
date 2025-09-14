// Coupon Management Utility for KODEON IDE

class CouponManager {
    constructor() {
        this.isInitialized = false;
        this.coupons = new Map();
    }

    async initialize() {
        this.isInitialized = true;

        // Load available coupons (in a real implementation, this would come from a server)
        this.loadCoupons();

        console.log("Coupon manager initialized");
    }

    loadCoupons() {
        // Sample coupons for demonstration
        this.coupons.set("WELCOME10", {
            code: "WELCOME10",
            discount: 10, // 10% off
            type: "percentage",
            maxUses: 100,
            used: 0,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });

        this.coupons.set("SAVE20", {
            code: "SAVE20",
            discount: 20, // 20% off
            type: "percentage",
            maxUses: 50,
            used: 0,
            validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        });

        this.coupons.set("FREEMONTH", {
            code: "FREEMONTH",
            discount: 9.99, // One free month of Pro plan
            type: "fixed",
            maxUses: 25,
            used: 0,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });
    }

    validateCoupon(code) {
        if (!this.isInitialized) {
            throw new Error("Coupon manager not initialized");
        }

        const coupon = this.coupons.get(code.toUpperCase());

        if (!coupon) {
            return { valid: false, error: "Invalid coupon code" };
        }

        // Check if coupon has expired
        if (new Date() > coupon.validUntil) {
            return { valid: false, error: "Coupon has expired" };
        }

        // Check if coupon has reached max uses
        if (coupon.used >= coupon.maxUses) {
            return { valid: false, error: "Coupon has reached maximum uses" };
        }

        return { valid: true, coupon: coupon };
    }

    applyCoupon(code, amount) {
        if (!this.isInitialized) {
            throw new Error("Coupon manager not initialized");
        }

        const validation = this.validateCoupon(code);

        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const coupon = validation.coupon;
        let discountAmount = 0;

        if (coupon.type === "percentage") {
            discountAmount = amount * (coupon.discount / 100);
        } else if (coupon.type === "fixed") {
            discountAmount = Math.min(coupon.discount, amount);
        }

        const discountedAmount = amount - discountAmount;

        // Increment used count
        coupon.used++;

        return {
            originalAmount: amount,
            discountAmount: discountAmount,
            discountedAmount: discountedAmount,
            coupon: coupon,
        };
    }

    getCouponInfo(code) {
        if (!this.isInitialized) {
            throw new Error("Coupon manager not initialized");
        }

        const coupon = this.coupons.get(code.toUpperCase());
        return coupon || null;
    }

    listAvailableCoupons() {
        if (!this.isInitialized) {
            throw new Error("Coupon manager not initialized");
        }

        const now = new Date();
        const availableCoupons = [];

        for (const [code, coupon] of this.coupons) {
            if (now <= coupon.validUntil && coupon.used < coupon.maxUses) {
                availableCoupons.push({
                    code: coupon.code,
                    discount: coupon.discount,
                    type: coupon.type,
                    validUntil: coupon.validUntil,
                });
            }
        }

        return availableCoupons;
    }

    async redeemCoupon(code, userId) {
        if (!this.isInitialized) {
            throw new Error("Coupon manager not initialized");
        }

        try {
            // In a real implementation, this would call a server API to redeem the coupon
            const validation = this.validateCoupon(code);

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Apply the coupon to the user's account
            console.log(`Coupon ${code} redeemed for user ${userId}`);

            return {
                success: true,
                message: "Coupon successfully redeemed",
                coupon: validation.coupon,
            };
        } catch (error) {
            console.error("Error redeeming coupon:", error);
            throw error;
        }
    }
}

module.exports = new CouponManager();
