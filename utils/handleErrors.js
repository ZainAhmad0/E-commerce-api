const handleErrors = (receivedFunction, args = null) => {
  try {
    if (args === null) {
      return receivedFunction();
    } else {
      return receivedFunction(...args);
    }
  } catch (err) {
    console.error(err);
    // res.status(err.status.error_code).send(err.status.error_message);
  }
};

module.exports = handleErrors;
