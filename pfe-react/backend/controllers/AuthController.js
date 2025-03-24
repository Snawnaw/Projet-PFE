const user await user.create({
    email,
    password,
});

//check if email and/or password is entered
if (!nom || !prenom) {
    return res.status(400).json({ message: "Veuillez saisir l'email et le mot de passe" });
}

//finding user in database
const user = await user.findOne({ email }.select("+password"));
if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
}

//check if password is correct
const MatchPass = await bcrypt.compare(password, user.password);
if (!MatchPass) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
}




