function validateBmpPayload(headers, payload) {

  if(payload){
  //TODO - Validate required fiels or keys only
  const allPresent = ["eventType", "platform", "accountNo", "data"].every((element) => Object.keys(payload).includes(element));

  if (allPresent) {
    return true

  } else {
    return false
  }
  }

}

module.exports = { validateBmpPayload }