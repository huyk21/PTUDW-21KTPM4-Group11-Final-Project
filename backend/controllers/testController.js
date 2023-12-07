//@desc Register user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  res.render("index", { layout: "layout" });
});
export { registerUser };
