const user = await User.create({
    nom,
    prenom,
    date_naissance,
    email,
    password,
    numero_tel,
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
if (!date_naissance) {
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
if (!numero_tel) {
    return res.status(400).json({ message: "Le numero de telephone est obligatoire" });
}


