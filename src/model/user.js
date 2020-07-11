import mongoose from '../config/DBHelpler'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  'userName': { type: String },
  'password': { type: String },
})

const UserModel = mongoose.model('users', UserSchema)

export default UserModel