import JWT from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  else {
    try {
      const decoded = JWT.verify(token, process.env.SECRET);
      req.user = decoded.user;
      console.log("user", decoded.user);
      next();
    } catch (e) {
      console.error(e);
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    else {
      const decoded = JWT.verify(token, process.env.SECRET);
      if (decoded.user.role === "admin") {
        next();
      } else {
        res.status(401).json({
          success: false,
          message: "Cannot access",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
