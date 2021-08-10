function getMessage(message) {
    if (message === undefined) throw new Error("No Message Found");
    console.log("😎", message)
};

module.exports = getMessage

