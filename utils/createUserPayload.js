const createUserPayload = (user) => {
  return { name: user.name, userId: user._id };
};

module.exports = createUserPayload;
