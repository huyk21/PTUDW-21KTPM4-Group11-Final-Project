import asyncHandler from "../middleware/asyncHandler.js";
//@desc Register user
//@route POST /api/users
//@access Public
const index = asyncHandler(async (req, res) => {
  res.send("helloooooo");
});

const login = asyncHandler(async (req, res) => {
  res.send("helloooooo");
});
export { index, login };
