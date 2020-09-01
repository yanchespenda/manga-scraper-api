import { FastifyRequest, FastifyReply } from "fastify";

// eslint-disable-next-line no-use-before-define
export const getIndex = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
        message: "Hello",
        frontEnd: "https://manga-scraping.arproject.web.id/",
        linkRepo: "https://github.com/yanchespenda/manga-scraper-api",
    })
}