import { FastifyRequest, FastifyReply } from "fastify";
import { MangaService } from "../lib/manga/services";

export const getIndexSupportSite = async (_request: FastifyRequest, reply: FastifyReply) => {

    const mangaService = new MangaService();

    return reply.send(mangaService.supportSite())
}