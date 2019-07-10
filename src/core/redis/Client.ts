import * as apicache from "apicache";
import { NextFunction, Request, Response } from "express";
import * as redis from "redis";
import config from "../../config/config";
import { log } from "../../core/Logger";

/**
 * Wrapper for redis cache
 * Provides middleware for cache used in routes
 * Usage: this.router.get("/routes", useCacheMiddleware(10000), getTrips);
 */
class Client {

    private defaultCacheTtl: any = parseInt(config.redis_ttl || "60000", 10);

    private redisClient = redis.createClient({
        host: config.redis_host,
        port: parseInt(config.redis_port as string, 10),
    }).on("message", (message: string) => log.info(message))
        .on("error", (error: any) => log.warn(error));

    private cacheWithRedisMiddleware = apicache
        .options({
            defaultDuration: this.defaultCacheTtl,
            redisClient: this.redisClient,
        })
        .middleware;

    constructor() {
        //
    }

    public getDefaultCacheTtl() {
        return this.defaultCacheTtl;
    }

    public isNoCacheHeader = (req: Request, res: Response): boolean => {
        const cacheHeader: string | undefined = req.headers["cache-control"];
        return cacheHeader === "no-cache";
    }

    public getMiddleware(expire?: number | string) {
        return this.middleware(expire);
    }

    private middleware = (expire?: number | string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!this.isNoCacheHeader(req, res) && config.redis_enable === "true") {
                const middleware = this.cacheWithRedisMiddleware(expire || this.defaultCacheTtl);
                middleware(req, res, next);
            } else {
                next();
            }
        };
    }
}

const client = new Client();
const useCacheMiddleware = (expire?: number | string) => client.getMiddleware(expire);

export { useCacheMiddleware };
