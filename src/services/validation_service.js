exports.isBlank = (text) => {
    return !text || text.trim() === '';
};

exports.validateLength = (text, min, max) => {
    return text.length >= min && (max && text.length <= max);
};