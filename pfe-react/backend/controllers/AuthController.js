const user = await User.create({
    email,
    password,
});

//check if email and/or password is entered
if (!email || !password) {
    return res.status(400).json({ message: "Veuillez saisir l'email et le mot de passe" });
}

//check if password is correct
const MatchPass = await bcrypt.compare(password, User.password);
if (!MatchPass) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
}

//finding user in database
const userFind = await user.findOne({ email }.select("+password"));
if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
}





