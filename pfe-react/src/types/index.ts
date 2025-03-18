export interface BaseType {
    id: string;  // Make sure all ID types are string
}

export interface Filiere extends BaseType {
    name: string;
    code: string;
    duration: number;
    modules: Module[];
}

export interface Module extends BaseType {
    name: string;
    semester: number;
    filiereId: string;
}

export interface Enseignant extends BaseType {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    grade: string;
    filiere: string;
    sections: string[];
}

export interface Section extends BaseType {
    name: string;
    filiere: string;
    niveau: number;
    nbGroupes: number;
}

export interface Exam extends BaseType {
    title: string;
    type: 'Final' | 'CC' | 'QCM' | 'TP';
    date: Date;
    duration: number;
    moduleId: string;
    filiereId: string;
}

export interface User extends BaseType {
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
}

export interface Teacher extends BaseType {
    name: string;
    department: string;
    specialization: string;
}

export interface Section extends BaseType {
    name: string;
    year: number;
    department: string;
}

export interface Room extends BaseType {
    number: string;
    capacity: number;
    type: 'classroom' | 'lab';
}

export interface Department extends BaseType {
    name: string;
    code: string;
}
