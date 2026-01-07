import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/userModel.js";

const generateTokensForUser = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = async ({ firstName, lastName, emailID, password, role }) => {
  if (!firstName || !lastName || !emailID || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ emailID });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({ firstName, lastName, emailID, password, role });
  const tokens = await generateTokensForUser(user);
  const userSafe = await User.findById(user._id).select("-password -refreshToken");
  return { user: userSafe, ...tokens };
};

export const login = async ({ emailID, firstName, password }) => {
  if (!password) throw new ApiError(400, "Password is required");
  if (!emailID && !firstName) throw new ApiError(400, "Email or username is required");

  const user = await User.findOne({ $or: [{ emailID }, { firstName }] });
  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const tokens = await generateTokensForUser(user);
  const userSafe = await User.findById(user._id).select("-password -refreshToken");
  return { user: userSafe, ...tokens };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
};

export const refresh = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, "Invalid refresh token");
  if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token expired or used");

  const tokens = await generateTokensForUser(user);
  return tokens;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
};

export const getCurrent = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateAccount = async (userId, { firstName, lastName, emailID }) => {
  if (!firstName || !emailID) throw new ApiError(400, "All fields are required");

  const existing = await User.findOne({ emailID, _id: { $ne: userId } });
  if (existing) throw new ApiError(409, "Email is already in use");

  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, emailID },
    { new: true }
  ).select("-password");

  return user;
};
