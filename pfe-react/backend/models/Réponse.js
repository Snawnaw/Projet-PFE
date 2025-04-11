const ReponseSchema = new Schema({
    id:{ 
        type: Number,
         unique: true,
         MaxLenght: [1, "L'id de la reponse ne doit pas depasser 3 caracteres"],
    },

    enonce:{
        type: String,
        required: [true, "Veuillez saisir l'enoncé de la reponse"],
        MaxLenght: [200, "L'enoncé de la reponse ne doit pas dépasser 200 caracteres"],
    },

    valeur:{
        type: Boolean,
        required: [true, "Veuillez saisir la valeur de la reponse"],
    },
    ///la specification de l'id de la question est geree en Backend
    question:{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, "Veuillez saisir l'id de la question"],
    },

    //difficulte et type ne sont pas necessaires
})