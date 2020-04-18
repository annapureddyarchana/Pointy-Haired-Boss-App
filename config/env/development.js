module.exports = {
    db:"mongodb://127.0.0.1:27017/pointy-haired-boss",
    serverURL: (process.env.ABSOLUTE_URL == "true") ? "" : "localhost:3000",
    sendgrid_api_key: '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',
    redis: "redis://localhost:6379",
};



