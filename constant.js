module.exports.ERROR = {
  INTERNAL_SERVER: 'Internal Server Error.',
  SIGNUP: 'An error occurred during signup process.',
  SIGNUP_CONFIRM: 'An error occurred during signup confirm process.',
  LOGIN: 'An error occurred during login process.',
  LOGOUT: 'An error occurred during logout process.',
  FORGET_PASSWORD: 'An error occurred during forget password process.',
  RESET_PASSWORD: 'An error occurred during reset password process.',
  PROFILE: 'An error occurred during retrieving profile process.',
  PROFILE_UPDATE: 'Am error occurred during updating profile process.',
  EMAIL_UPDATE: 'An error occurred during updating email process.',
  EMAIL_UPDATE_CONFIRM:
    'An error occurred during confirmation email update process.',
  PASSWORD_UPDATE: 'An error occurred during updating password process.',
  CATEGORY_LIST: 'An error occurred during retrieving category list process.',
  BOOK_LIST: 'An error occurred during retrieving book list process.',
  BOOK: 'An error occurred during retrieving book process.',
  CATEGORY: 'An error occurred during retrieving category process.',
  BOOK_CREATE: 'An error occurred during creating book process.',
  CATEGORY_CREATE: 'An error occurred during creating category process',
  BOOK_UPDATE: 'An error occurred dring updating book process.',
  CATEGORY_UPDATE: 'An error occurred during updating category process',
  BOOK_DELETE: 'An error occurred during deleting book process.',
  CATEGORY_DELETE: 'An error occurred during deleting category process',
  USER_LIST: 'An error occurred during retireving user list process.',
  USER: 'An error occurred during retrieving user process.',
  USER_CREATE: 'An error occurred during creating user process.',
  USER_SUSPEND: 'An error occurred during suspending user process.',
  USER_UPDATE: 'An error occurred during updating user profile process.',
  USER_DELETE: 'An error occurred during deleting user process.',
  USER_EXIST_MESSAGE: 'User already exists.',
  CATEGORY_EXIST_MESSAGE: 'Category already exists.',
  USER_SUSPEND_MESSAGE: 'User was suspended.',
  CURRENT_EMAIL_ERROR: 'Request email must be different with current email.',
  EXPIRED_MESSAGE: 'Expired token.',
  TOKEN_NOT_FOUND: 'Token Not Found.',
  USER_NOT_FOUND: 'User Not Found.',
  CATEGORY_NOT_FOUND: 'Category Not Found.',
  BOOK_NOT_FOUND: 'Book Not Found.',
  NEED_AUTH: 'User is need to authenticate.',
  INCORRECT_PASSWORD: 'Incorrect password, please try again.',
  INCORRECT_CURRENT_PASSWORD: 'Current password is incorrect.',
  NO_AUTH: 'User not login, please login first.',
  PERMISSION: 'You have no permission to use this service.',
  NOT_SUSPEND: "Can't suspend no authenticated user.",
}

module.exports.USER_TYPE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  PREMIUM_USER: 'PREMIUM_USER',
  USER: 'USER',
}

module.exports.AUTH_STATUS = {
  NO_AUTH: 'NO_AUTH',
  AUTHED: 'AUTHED',
  SUSPENDED: 'SUSPENDED',
}

module.exports.TOKEN_TYPE = {
  SIGNUP: 'SIGNUP',
  AUTH: 'AUTH',
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_UPDATE: 'EMAIL_UPDATE',
}

module.exports.GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
}

module.exports.PUBLISH_STATUS = {
  PUBLISH: 'PUBLISH',
  DRAFT: 'DRAFT',
}

module.exports.RATE = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

module.exports.IS_AVAILABLE = {
  AVAILABLE: true,
  UNAVAILABLE: false,
}

module.exports.AVATAR =
  'https://img.icons8.com/ios-glyphs/100/000000/user-male-circle.png'
