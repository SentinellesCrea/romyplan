import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ La variable d’environnement MONGODB_URI est manquante');
}

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'romyplan', // ou autre nom selon ton projet
      bufferCommands: false,
    }).then((conn) => {
      console.log('✅ Connecté à MongoDB Atlas - DB : romyplan');
      return conn;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export default dbConnect;
