exports.base64Encode = content => {
  let encodedContent

  if (typeof content === 'object') {
    encodedContent = JSON.stringify(content)
  } else {
    encodedContent = content
  }

  // return btoa(encodedContent)
  return Buffer.from(encodedContent, 'utf8').toString('base64')
}

exports.base64Decode = base64Content => {
  // return atob(base64Content)
  return Buffer.from(base64Content, 'base64').toString('utf8')
}