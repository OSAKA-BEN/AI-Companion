import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function getRateLimit(identifier: string) {
  const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  return rateLimit.limit(identifier);
}
