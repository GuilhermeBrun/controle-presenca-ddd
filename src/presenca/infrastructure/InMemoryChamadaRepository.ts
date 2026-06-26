import { Chamada } from "../domain/Chamada.js";
import { ChamadaRepository } from "../domain/repositories/ChamadaRepository.js";
import { ChamadaId } from "../domain/value-objects/ChamadaId.js";

export class InMemoryChamadaRepository implements ChamadaRepository {
  private readonly chamadas = new Map<string, Chamada>();

  async obterPorId(id: ChamadaId): Promise<Chamada | null> {
    return this.chamadas.get(id.value) ?? null;
  }

  async adicionar(chamada: Chamada): Promise<void> {
    this.chamadas.set(chamada.id.value, chamada);
  }

  async salvar(chamada: Chamada): Promise<void> {
    this.chamadas.set(chamada.id.value, chamada);
  }
}
