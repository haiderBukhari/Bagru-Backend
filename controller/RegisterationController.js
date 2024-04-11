import Registration from "../model/RegisterationModel.js";
import jwt from 'jsonwebtoken'

export const RegisterUser = async (req, res) => {
    try {
        const tempData = await Registration.findOne({email: req.body.email});
        if(tempData){
            return res.status(400).json({ message: 'User already exists' });
        }
        const registration = new Registration({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await registration.save();
        const token = jwt.sign({ id: registration._id }, process.env.JWT_SECRET_KEY);
        return res.status(200).json({ message: 'Registration Successful', auth: token, success: true });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.query;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await Registration.findOne({ email: email, password: password  });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.devicesLogined >=1 ){
            return res.status(404).json({ message: 'You can Login with at max 1 devices' });
        }
        user.devicesLogined = user.devicesLogined + 1;
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: 'Login successful', auth: token, user: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
        const user = await Registration.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.devicesLogined = user.devicesLogined - 1;
        await user.save();
        res.status(200).json({ message: 'Logout successful' });
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}