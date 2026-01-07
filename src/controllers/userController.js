import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as userService from "../services/userService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const registerUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await userService.register(
    req.body
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user, accessToken, refreshToken }, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await userService.login(
    req.body
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "User logged In Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await userService.logout(req.user._id);
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await userService.refresh(incomingRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await userService.changePassword(req.user._id, oldPassword, newPassword);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getCurrent(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const updated = await userService.updateAccount(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, updated, "Account details updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};
