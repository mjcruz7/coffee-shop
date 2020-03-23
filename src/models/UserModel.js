const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = moongose.Schema;

const validRole = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is an invalid role.'
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required.']
    },
    email: {
        type: String,
        required: [true, 'User email is required.'],
        unique: [true, 'User email is already associated to another user.']
    },
    password: {
        type: String,
        required: [true, 'User password is required.']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRole
    },
    img: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

UserSchema.plugin(uniqueValidator, {
    message: 'User email must be unique.'
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

const UserModel = moongose.model('User', UserSchema);

module.exports = UserModel;