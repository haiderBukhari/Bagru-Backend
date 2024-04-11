import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
        },
        devicesLogined: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;