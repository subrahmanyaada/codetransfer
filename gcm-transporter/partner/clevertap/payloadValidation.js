function validateCleverTapFreeformPayload(model) {
  // TODO - move to config
  const allPresent = ["to", "wabaNumber", "isTemplate", "msgId", "type"].every(
    (element) => Object.keys(model).includes(element)
  );

  if (allPresent) {
    return true;
  } else {
    return false;
  }
}


function validateCleverTapTemplatePayload(model) {
  // TODO - move to config
  const allPresent = ["to", "wabaNumber", "isTemplate", "msgId", "template","components"].every(
    (element) => Object.keys(model).includes(element)
  );

  if (allPresent) {
    return true;
  } else {
    return false;
  }
}

module.exports = { validateCleverTapFreeformPayload, validateCleverTapTemplatePayload };
