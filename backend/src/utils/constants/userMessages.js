const USER = {
  SIGNUP_SUCCESS: "Successfully registered user.",
  SIGNUP_FAILED: "Failed to sign up. Please try again.",
  LOGIN_SUCCESS: "Successfully logged in.",
  LOGIN_FAILED: "Login failed. Please try again.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  LOGOUT_FAILED: "Something went wrong while logging out.",
  MISSING_TOKEN: "No token found. User is not logged in.",
  PROFILE_SUCCESS: "Successfully fetched user profile.",
  PROFILE_NOT_FOUND: "Profile not found. Please check the details.",
  PROFILE_FAILED: "Something went wrong while fetching profile.",
  UPDATE_SUCCESS: "Successfully updated user.",
  UPDATE_FAILED: "Something went wrong while updating profile.",
  EMPTY_UPDATE_BODY: "No data provided to update.",
  SIGNUP_DUPLICATE: "A user with this phone or email already exists.",
  LOGIN_MISSING_CREDENTIALS: "Phone or email is required to login.",
  LOGIN_USER_NOT_FOUND: "Invalid credentials. User not found.",
  LOGIN_INCORRECT_PASSWORD: "Invalid credentials. Incorrect password.",
  USER_NOT_FOUND: "User not found.",
  FIELD_IMMUTABLE: (field) =>
    `${field} can only be set once. Please contact customer support to change it.`,
};

module.exports = USER;
