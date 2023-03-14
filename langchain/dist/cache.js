var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _InMemoryCache_cache, _RedisCache_redisClient;
import crypto from "node:crypto";
/**
 * This cache key should be consistent across all versions of langchain.
 * It is currently NOT consistent across versions of langchain.
 *
 * A huge benefit of having a remote cache (like redis) is that you can
 * access the cache from different processes/machines. The allows you to
 * seperate concerns and scale horizontally.
 *
 * TODO: Make cache key consistent across versions of langchain.
 */
const getCacheKey = (prompt, llmKey, idx) => {
    const key = `${prompt}_${llmKey}${idx ? `_${idx}` : ""}`;
    return crypto.createHash("sha256").update(key).digest("hex");
};
export class BaseCache {
}
export class InMemoryCache extends BaseCache {
    constructor() {
        super();
        _InMemoryCache_cache.set(this, void 0);
        __classPrivateFieldSet(this, _InMemoryCache_cache, new Map(), "f");
    }
    lookup(prompt, llmKey) {
        return Promise.resolve(__classPrivateFieldGet(this, _InMemoryCache_cache, "f").get(getCacheKey(prompt, llmKey)) ?? null);
    }
    async update(prompt, llmKey, value) {
        __classPrivateFieldGet(this, _InMemoryCache_cache, "f").set(getCacheKey(prompt, llmKey), value);
    }
}
_InMemoryCache_cache = new WeakMap();
/**
 *
 * TODO: Generalize to support other types.
 */
export class RedisCache extends BaseCache {
    constructor(redisClient) {
        super();
        _RedisCache_redisClient.set(this, void 0);
        __classPrivateFieldSet(this, _RedisCache_redisClient, redisClient, "f");
    }
    async lookup(prompt, llmKey) {
        let idx = 0;
        let key = getCacheKey(prompt, llmKey, String(idx));
        let value = await __classPrivateFieldGet(this, _RedisCache_redisClient, "f").get(key);
        const generations = [];
        while (value) {
            if (!value) {
                break;
            }
            generations.push({ text: value });
            idx += 1;
            key = getCacheKey(prompt, llmKey, String(idx));
            value = await __classPrivateFieldGet(this, _RedisCache_redisClient, "f").get(key);
        }
        return generations.length > 0 ? generations : null;
    }
    async update(prompt, llmKey, value) {
        for (let i = 0; i < value.length; i += 1) {
            const key = getCacheKey(prompt, llmKey, String(i));
            await __classPrivateFieldGet(this, _RedisCache_redisClient, "f").set(key, value[i].text);
        }
    }
}
_RedisCache_redisClient = new WeakMap();
//# sourceMappingURL=cache.js.map