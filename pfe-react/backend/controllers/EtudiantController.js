const Etudiant = require("../models/Etudiant");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { create } = require("../models/Section");
const mongoose = require("mongoose");

// Get all students
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find()
      .populate("filiere", "nom niveau") // Add niveau to populate
      .populate("section", "nom niveau") // Add niveau to populate
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      etudiants: etudiants.map((etudiant) => ({
        _id: etudiant._id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        numero_tel: etudiant.numero_tel,
        date_naissance: etudiant.date_naissance,
        niveau: etudiant.filiere?.niveau || etudiant.section?.niveau || "N/A",
        filiere: etudiant.filiere?.nom || "N/A",
        section: etudiant.section?.nom || "N/A",
        role: etudiant.role,
        createdAt: etudiant.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get teacher by ID
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEtudiantByEmail = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({ email: req.params.email });
    if (!etudiant)
      return res.status(404).json({ message: "Etudiant non trouvé" });
    res.json({ etudiant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEtudiantsBySection = async (req, res) => {
  try {
    const { sectionID } = req.params;
    const etudiants = await Etudiant.find({ section: sectionID }); // Filtrer par filière
    res.status(200).json({
      success: true,
      etudiants,
    });
  } catch (error) {
    console.error("Error fetching etudiants:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new student
exports.createEtudiant = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const {
      nom,
      prenom,
      date_naissance,
      numero_tel,
      email,
      password,
      role = "etudiant",
      filiere,
      section,
      niveau, // Add niveau field
    } = req.body;

    // Validate required fields
    if (
      !nom ||
      !prenom ||
      !date_naissance ||
      !numero_tel ||
      !email ||
      !password ||
      !filiere ||
      !section
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    if (!mongoose.Types.ObjectId.isValid(filiere)) {
      return res
        .status(400)
        .json({ message: "Filière invalide ou manquante." });
    }
    if (!mongoose.Types.ObjectId.isValid(section)) {
      return res
        .status(400)
        .json({ message: "Section invalide ou manquante." });
    }

    // Check if student already exists
    const existingEtudiant = await Etudiant.findOne({ nom, prenom });
    if (existingEtudiant) {
      return res.status(400).json({ message: "Cet etudiant existe déjà" });
    }

    const existingEmail = await Etudiant.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    if (!req.body.numero_tel) {
      return res
        .status(400)
        .json({ message: "Le champ numero de telephone est requis." });
    }

    if (!date_naissance) {
      return res
        .status(400)
        .json({ message: "Veuillez choisir une date de naissance." });
    }

    const existingPhone = await Etudiant.findOne({ numero_tel });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Ce numéro de téléphone existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const etudiant = new Etudiant({
      nom,
      prenom,
      date_naissance,
      numero_tel,
      email,
      password: hashedPassword,
      role,
      filiere,
      section,
      niveau, // Include niveau field
      createdAt: new Date(),
    });

    await etudiant.save();

    await User.create({
      nom,
      prenom,
      date_naissance,
      numero_tel,
      email,
      password,
      role: "etudiant",
    });

    res.status(201).json({ message: "Etudiant créé avec succès" });
  } catch (error) {
    // Log validation errors in detail
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    console.error("Erreur lors de la création de l'etudiant :", error);
    res.status(500).json({ message: error.message });
  }
};

// Update student
exports.updateEtudiant = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      date_naissance,
      numero_tel,
      email,
      password,
      role,
      filiere,
      section,
      niveau, // Add niveau field
    } = req.body;

    // Check if new email already exists
    if (email) {
      const existingEmail = await Etudiant.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Cet email existe déjà" });
      }
    }

    // Check if new phone number already exists
    if (numero_tel) {
      const existingPhone = await Etudiant.findOne({
        numero_tel,
        _id: { $ne: req.params.id },
      });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Ce numéro de téléphone existe déjà" });
      }
    }

    const updateFields = {
      nom,
      prenom,
      date_naissance,
      numero_tel,
      email,
      role,
    };
    if (filiere) updateFields.filiere = filiere;
    if (section) updateFields.section = section;
    if (niveau) updateFields.niveau = niveau; // Add niveau to update fields
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updatedEtudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedEtudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }
    res.status(200).json(updatedEtudiant);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete student
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiantId = req.params.id;

    // First check if student exists
    const existingEtudiant = await Etudiant.findById(etudiantId);
    if (!existingEtudiant) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    // Delete from Etudiant collection
    const deletedEtudiant = await Etudiant.findByIdAndDelete(etudiantId);

    // Also delete from User collection if it exists
    try {
      await User.findOneAndDelete({
        email: existingEtudiant.email,
        role: "etudiant",
      });
    } catch (userDeleteError) {
      console.log(
        "User entry not found or already deleted:",
        userDeleteError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Étudiant supprimé avec succès",
      deletedEtudiant: {
        _id: deletedEtudiant._id,
        nom: deletedEtudiant.nom,
        prenom: deletedEtudiant.prenom,
      },
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Teacher login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const etudiant = await Etudiant.findOne({ email }).select("+password");
    if (!etudiant) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, etudiant.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: etudiant._id, email: etudiant.email, role: etudiant.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      etudiant: {
        id: etudiant._id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        date_naissance: etudiant.date_naissance,
        numero_tel: etudiant.numero_tel,
        email: etudiant.email,
        role: etudiant.role,
        module: etudiant.module,
        createdAt: etudiant.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  // Exemple pour les modules
  exports.getModulesByEnseignant = async (req, res) => {
    const modules = await Module.find({ enseignant: req.params.enseignantId });
    res.json({ modules });
  };

  // Exemple pour les filières
  exports.getFilieresByEnseignant = async (req, res) => {
    const filieres = await Filiere.find({
      enseignants: req.params.enseignantId,
    });
    res.json({ filieres });
  };

  // Exemple pour les sections
  exports.getSectionsByEnseignant = async (req, res) => {
    const sections = await Section.find({
      enseignants: req.params.enseignantId,
    });
    res.json({ sections });
  };
};
