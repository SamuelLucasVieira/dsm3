import mongoose from "mongoose";
const { Schema } = mongoose;

// define os schemas
const CarSchema = new Schema({
    model:{
        type: String,
        maxlength:[15, "O modelo pode ter no máximo 15 linhas"],
        unique: true,
        require: [true,"O modelo é obrigatório"]
    }
})
const PersonSchema = new Schema({
    name:{
        type: String,
        maxlength:[30, "O modelo pode ter no máximo 15 linhas"],
        unique: true,
        require: [true,"O modelo é obrigatório"]
    }
})
const PhoneSchema = new Schema({
    person:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        require: [true,"O modelo é obrigatório"],
        validate: {
            validator: async function(id:string) {
                
                
            }
        }
    }
})
const UserSchema = new Schema({
  mail: {
    type: String,
    maxlength: [50, "O e-mail pode ter no máximo 30 caracteres"],
    unique: true,
    required: [true, "O e-mail é obrigatório"],
    validate: {
      validator: function (value: string) {
        // expressão regular para validar o formato do e-mail
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
      },
      message: (props: any) =>
        `${props.value} não é um formato de e-mail válido`,
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, "A senha precisa ter no mínimo 6 caracteres"],
    maxlength: [10, "A senha precisa ter no máximo 10 caracteres"],
    select: false,
    required: [true, "A senha é obrigatória"],
  },
});

const SpentSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    validate: {
      validator: async function (id:string) {
        const user = await User.findById(id);  // verifica se id existe na coleção users
        return !!user; // true se o usuário existir
      },
      message: 'O usuário fornecido não existe',
    },
  },
  description: { 
    type: String, 
    maxlength: 30, 
    required: [true, "A descrição é obrigatória"],
  },
  value: { 
    type: Number, 
    required: [true, "O valor é obrigatório"],
  },
});

// mongoose.model compila o modelo
const User = mongoose.model("User", UserSchema);
const Spent = mongoose.model("Spent", SpentSchema);

export { User, Spent };
