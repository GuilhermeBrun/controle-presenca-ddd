import { Chamada } from "../Chamada.js";
import { ChamadaId } from "../value-objects/ChamadaId.js";

export interface ChamadaRepository {
  obterPorId(id: ChamadaId): Promise<Chamada | null>;
  adicionar(chamada: Chamada): Promise<void>;
  salvar(chamada: Chamada): Promise<void>;
}
