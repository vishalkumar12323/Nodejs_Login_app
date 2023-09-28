const jwt = require("jsonwebtoken");
const contactSchema = require("../../model/contactSchema");

const authentication = async (req, res, next) => {
  const token = await contactSchema.toknes;
  const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
  console.log(verifyToken);
  //   next();
};

module.exports = authentication;
