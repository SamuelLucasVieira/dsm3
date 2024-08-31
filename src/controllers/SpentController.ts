import { Request, Response } from "express";
import { Spent } from "../models";

class SpentController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user, description, value } = req.body;
    try {
      const document = new Spent({ user, description, value });
      // ao salvar serão aplicadas as validações do esquema
      const response = await document.save();
      return res.json(response);
    } catch (error: any) {
      if (error && error.errors["description"]) {
        return res.json({ message: error.errors["description"].message });
      } else if (error && error.errors["value"]) {
        return res.json({ message: error.errors["value"].message });
      } else if (error && error.errors["user"]) {
        return res.json({ message: error.errors["user"].message });
      }
      return res.json({ message: error });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { user } = req.body; // _id do usuário da chave estrangeira
    try {
      // o método select recebe os campos incluídos no resultado
      const objects = await Spent.find({ user })
        .select("description value")
        .sort({ description: "asc" });
      return res.json(objects);
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.body; // _id do registro a ser excluído
    try {
      const object = await Spent.findByIdAndDelete(_id);
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
    const { id, user, description, value } = req.body;
    try {
      // busca o gasto existente na coleção antes de fazer o update
      const document = await Spent.findById(id);
      if (!document) {
        return res.json({ message: "Gasto inexistente" });
      }
      // atualiza os campos
      document.user = user;
      document.description = description;
      document.value = value;
      // ao salvar serão aplicadas as validações do esquema
      const response = await document.save();
      return res.json(response);
    } catch (error: any) {
      if (error && error.errors["description"]) {
        return res.json({ message: error.errors["description"].message });
      } else if (error && error.errors["value"]) {
        return res.json({ message: error.errors["value"].message });
      } else if (error && error.errors["user"]) {
        return res.json({ message: error.errors["user"].message });
      }
      return res.json({ message: error });
    }
  }
}

export default new SpentController();
