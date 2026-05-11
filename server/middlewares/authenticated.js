const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;

    next();
  } catch (e) {
    res.status(500).json({ error: e.message || "Unauthorized" });
  }
};
