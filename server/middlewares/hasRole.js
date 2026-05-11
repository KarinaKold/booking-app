module.exports = function (roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({
        error: "Access denied: you do not have the required permissions",
      });
    }
    next();
  };
};
