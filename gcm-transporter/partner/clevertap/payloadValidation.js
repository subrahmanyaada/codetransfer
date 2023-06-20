function validateCleverTapPayload(model) {
  // TODO - move to config
  const allPresent = ["to", "wabaNumber", "isTemplate", "msgId"].every(
    (element) => Object.keys(model).includes(element)
  );

  if (allPresent) {
    return true;
  } else {
    return false;
  }
}

module.exports = { validateCleverTapPayload };
