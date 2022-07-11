const getPrivateRoute = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "User has access to private route",
  });
};

module.exports = getPrivateRoute;
