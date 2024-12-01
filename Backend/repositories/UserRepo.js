const User = require("../schemas/UserSchema");

async function registerAccount(req, res) {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password});
    

    try {
        const checkuserusername = await User.findOne({username});
        const checkuseremail = await User.findOne({email});
        if (checkuserusername){
            return res.status(409).json({ message: "Username  already exist"});    
        }
        else if(checkuseremail){
            return res.status(409).json({ message: "E-mail already exist"});    
        }
        await user.save();
        return res.status(200).json({ message: "Create Account Success", account: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function loginAccount(req, res) {
    const { username, password} = req.body;
    
    try {
        const user = await User.findOne({username, password});
        
        if (user){
            return res.status(200).json({message: "Login Success", account: user});
        }
        res.status(404).json({ message: "Account not found! Make sure your username and password are correct!"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAccount(req, res) {
    const { username} = req.params;
    
    try {
        const user = await User.findOne({username});
        
        if (user){
            return res.status(200).json({message: "Get Account Success", account: user});
        }
        return res.status(404).json({ message: "Get Account Failed!"});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function changePassword(req, res) {
    const { username, email, newPassword } = req.body;
    
    try {
        let user;
        if (username) {
            user = await User.findOne({ username });
        } 
        else if (email) {
            user = await User.findOne({ email });
        } 
        else {
            return res.status(400).json({ message: "Username or email is required" });
        }
        
        if (!user) {
            return res.status(404).json({ message: "Account not found!" });
        }
                
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Change Password Success", account: user });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    registerAccount,
    loginAccount,
    getAccount,
    changePassword
};