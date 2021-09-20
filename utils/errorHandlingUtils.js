function handleErrors (receivedFunction, args = null){
  try {
    if (args === null) {
      return receivedFunction();
    } else {
      return receivedFunction(args);
    }
  } catch (err) {
    return err;
};
}

export {handleErrors};