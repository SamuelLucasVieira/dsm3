import { Request, Response } from "express";
import { User } from "../models";

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { mail, password } = req.body;
    try {
      //a instância de um modelo é chamada de documento
      const document = new User({ mail, password });
      // ao salvar serão aplicadas as validações do esquema
      const resp = await document.save();
      return res.json(resp);
    } catch (error: any) {
      if (error.code === 11000 || error.code === 11001) {
        // código 11000 e 11001 indica violação de restrição única (índice duplicado)
        return res.json({ message: "Este e-mail já está em uso" });
      } else if (error && error.errors["mail"]) {
        return res.json({ message: error.errors["mail"].message });
      } else if (error && error.errors["password"]) {
        return res.json({ message: error.errors["password"].message });
      }
      return res.json({ message: error.message });
    }
}

  public async list(_: Request, res: Response): Promise<Response> {
    try {
      const objects = await User.find().sort({ mail: "asc" });
      return res.json(objects);
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.body; // _id do registro a ser excluído
    try {
      const object = await User.findByIdAndDelete(_id);
      if (object) {
        return res.json({ message: "Registro excluído com sucesso" });
      } else {
        return res.json({ message: "Registro inexistente" });
      }
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, mail, password } = req.body;
    try {
      // busca o usuário existente na coleção antes de fazer o update
      const document = await User.findById(id);
      if (!document) {
        return res.json({ message: "Usuário inexistente" });
      }
      // atualiza os campos
      document.mail = mail;
      document.password = password;
      // ao salvar serão aplicadas as validações do esquema
      const resp = await document.save();
      return res.json(resp);
    } catch (error: any) {
      if (error.code === 11000 || error.code === 11001) {
        // código 11000 e 11001 indica violação de restrição única (índice duplicado)
        return res.json({ message: "Este e-mail já está em uso" });
      } else if (error && error.errors["mail"]) {
        return res.json({ message: error.errors["mail"].message });
      } else if (error && error.errors["password"]) {
        return res.json({ message: error.errors["password"].message });
      }
      return res.json({ message: error.message });
}
  }
}

export default new UserController();
