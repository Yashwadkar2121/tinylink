const validator = require("validator");

const validateUrl = (url) => {
  return validator.isURL(url, {
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ["http", "https"],
  });
};

const validateShortCode = (code) => {
  return /^[A-Za-z0-9_-]{1,8}$/.test(code);
};

module.exports = {
  validateUrl,
  validateShortCode,
};
