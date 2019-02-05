process.env.PORT = process.env.PORT || 3000

process.env.urlDb = process.env.NODE_ENV? process.env.MONGO_URI : 'dev'