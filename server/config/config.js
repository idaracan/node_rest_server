//  definición de puertos
process.env.PORT = process.env.PORT || 3000
//  definición de base de datos
process.env.urlDb = process.env.NODE_ENV? process.env.MONGO_URI : 'mongodb://localhost:27017/cafe'
//  caducidad del token
process.env.expiresIn = '48h'
//  seed de desarollo
process.env.SEED = process.env.SEED || 'seed-des'
//  google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '408375448137-e6286mm1p20ha7gs2p1fennjqp0ucgno.apps.googleusercontent.com'