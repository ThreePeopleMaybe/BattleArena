module.exports = ({ config }) => ({
    ...config,
    extra: {
        ...(config.extra ?? {}),
        battleArenaApiUrl: process.env.BATTLEARENA_API_URL,
    },
});