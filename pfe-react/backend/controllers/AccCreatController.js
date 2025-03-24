const user await User.create({
    nom,
    prenom,
    dateNaissance,
    email,
    password,
    numeroTelephone,
});

//check if name is entered
if (!nom) {
    return res.status(400).json({ message: "Le nom est obligatoire" });
}

//check if first name is entered
if (!prenom) {
    return res.status(400).json({ message: "Le prenom est obligatoire" });
}

//check if date of birth is entered
if (!dateNaissance) {
    return res.status(400).json({ message: "La date de naissance est obligatoire" });
}

//check if email is entered
if (!email) {
    return res.status(400).json({ message: "L'email est obligatoire" });
}

//check if password is entered
if (!password) {
    return res.status(400).json({ message: "Le mot de passe est obligatoire" });
}

//check if phone number is entered
if (!numeroTelephone) {
    return res.status(400).json({ message: "Le numero de telephone est obligatoire" });
}


