const PromoCode = require("../models/PromoCode");

exports.validatePromo = async (req, res) => {
  const { code, price } = req.body;

  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    active: true
  });

  if (!promo) {
    return res.status(404).json({
      success: false,
      message: "Invalid promo code"
    });
  }

  const discount = (price * promo.discountPercentage) / 100;

  res.json({
    success: true,
    discount,
    finalPrice: price - discount
  });
};