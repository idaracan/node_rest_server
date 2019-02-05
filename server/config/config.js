//  definición de puertos
process.env.PORT = process.env.PORT || 3000
//  definición de base de datos
process.env.urlDb = process.env.NODE_ENV? process.env.MONGO_URI : 'dev'