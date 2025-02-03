import { PGLiteDatabaseAdapter } from "@elizaos/adapter-pglite";
import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { RedisClient } from "@elizaos/adapter-redis";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { SupabaseDatabaseAdapter } from "@elizaos/adapter-supabase";
import { AutoClientInterface } from "@elizaos/client-auto";
import { DiscordClientInterface } from "@elizaos/client-discord";
import { FarcasterAgentClient } from "@elizaos/client-farcaster";
import { LensAgentClient } from "@elizaos/client-lens";
import { SlackClientInterface } from "@elizaos/client-slack";
import { TelegramClientInterface } from "@elizaos/client-telegram";
import { TwitterClientInterface } from "@elizaos/client-twitter";
// import { ReclaimAdapter } from "@elizaos/plugin-reclaim";
// import { DirectClient } from "@elizaos/client-direct";
import { PrimusAdapter } from "@elizaos/plugin-primus";

import {
    Action,
    ActionExample,
    AgentRuntime,
    CacheManager,
    CacheStore,
    Character,
    Client,
    Clients,
    Content,
    DbCacheAdapter,
    defaultCharacter,
    elizaLogger,
    FsCacheAdapter,
    generateObject,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    ICacheManager,
    IDatabaseAdapter,
    IDatabaseCacheAdapter,
    Memory,
    ModelClass,
    ModelProviderName,
    settings,
    State,
    stringToUuid,
    validateCharacterConfig,
} from "@elizaos/core";
import { zgPlugin } from "@elizaos/plugin-0g";

import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import createGoatPlugin from "@elizaos/plugin-goat";
// import { intifacePlugin } from "@elizaos/plugin-intiface";
import { DirectClient } from "@elizaos/client-direct";
import { ThreeDGenerationPlugin } from "@elizaos/plugin-3d-generation";
import { abstractPlugin } from "@elizaos/plugin-abstract";
import { alloraPlugin } from "@elizaos/plugin-allora";
import { aptosPlugin } from "@elizaos/plugin-aptos";
import { artheraPlugin } from "@elizaos/plugin-arthera";
import { availPlugin } from "@elizaos/plugin-avail";
import { avalanchePlugin } from "@elizaos/plugin-avalanche";
import { binancePlugin } from "@elizaos/plugin-binance";
import {
    advancedTradePlugin,
    coinbaseCommercePlugin,
    coinbaseMassPaymentsPlugin,
    tokenContractPlugin,
    tradePlugin,
    webhookPlugin,
} from "@elizaos/plugin-coinbase";
import { coinmarketcapPlugin } from "@elizaos/plugin-coinmarketcap";
import { coingeckoPlugin } from "@elizaos/plugin-coingecko";
import { confluxPlugin } from "@elizaos/plugin-conflux";
import { createCosmosPlugin } from "@elizaos/plugin-cosmos";
import { cronosZkEVMPlugin } from "@elizaos/plugin-cronoszkevm";
import { echoChambersPlugin } from "@elizaos/plugin-echochambers";
import { evmPlugin } from "@elizaos/plugin-evm";
import { flowPlugin } from "@elizaos/plugin-flow";
import { fuelPlugin } from "@elizaos/plugin-fuel";
import { genLayerPlugin } from "@elizaos/plugin-genlayer";
import { imageGenerationPlugin } from "@elizaos/plugin-image-generation";
import { lensPlugin } from "@elizaos/plugin-lensNetwork";
import { multiversxPlugin } from "@elizaos/plugin-multiversx";
import { nearPlugin } from "@elizaos/plugin-near";
import { nftGenerationPlugin } from "@elizaos/plugin-nft-generation";
import { createNodePlugin } from "@elizaos/plugin-node";
import { obsidianPlugin } from "@elizaos/plugin-obsidian";
import { sgxPlugin } from "@elizaos/plugin-sgx";
import { solanaPlugin } from "@elizaos/plugin-solana";
import { solanaAgentkitPlguin } from "@elizaos/plugin-solana-agentkit";
import { autonomePlugin } from "@elizaos/plugin-autonome";
import { storyPlugin } from "@elizaos/plugin-story";
import { suiPlugin } from "@elizaos/plugin-sui";
import { TEEMode, teePlugin } from "@elizaos/plugin-tee";
import { teeLogPlugin } from "@elizaos/plugin-tee-log";
import { teeMarlinPlugin } from "@elizaos/plugin-tee-marlin";
import { tonPlugin } from "@elizaos/plugin-ton";
import { webSearchPlugin } from "@elizaos/plugin-web-search";

import { giphyPlugin } from "@elizaos/plugin-giphy";
import { letzAIPlugin } from "@elizaos/plugin-letzai";
import { thirdwebPlugin } from "@elizaos/plugin-thirdweb";
import { hyperliquidPlugin } from "@elizaos/plugin-hyperliquid";
import { zksyncEraPlugin } from "@elizaos/plugin-zksync-era";

import { OpacityAdapter } from "@elizaos/plugin-opacity";
import { openWeatherPlugin } from "@elizaos/plugin-open-weather";
import { stargazePlugin } from "@elizaos/plugin-stargaze";
import { akashPlugin } from "@elizaos/plugin-akash";
import { quaiPlugin } from "@elizaos/plugin-quai";
import Database from "better-sqlite3";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";
// import {dominosPlugin} from "@elizaos/plugin-dominos";



const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import { z } from "zod";
import { Scraper } from "agent-twitter-client";

//*******************************POST THREAD ACTION *******************************//
export interface CoinMetadata {
    symbol: string;
    name: string;
    description: string;
}

export interface CoinData {
    isMintable: string;
    lpBurnt: string;
    coinSupply: string;
    coinMetadata: CoinMetadata;
    tokensInLiquidity: string;
    top10HolderPercentage: string;
    top20HolderPercentage: string;
    totalLiquidityUsd: number;
    timeCreated: string;
    volume6h: string;
    volume24h: string;
    isCoinHoneyPot: boolean;
}

export interface ThreadContent {
    tweets: string[];
}

export const ThreadSchema = z.object({
    tweets: z
        .array(z.string())
        .describe("Array of tweets that make up the thread"),
});

export const isThreadContent = (obj: any): obj is ThreadContent => {
    return ThreadSchema.safeParse(obj).success;
};

export async function getTrendingCoins(): Promise<CoinData[]> {
    const API_KEY = "insidex_api.6WLT6sDeDbszNP77HfCW3ici";
    const BASE_URL = "https://api-ex.insidex.trade/coins";

    try {
        const response = await fetch(`${BASE_URL}/trending`, {
            headers: {
                "x-api-key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Remove iconUrl from each coin's metadata
        return data.map((coin: any) => {
            if (coin.coinMetadata && coin.coinMetadata.iconUrl) {
                const { iconUrl, ...restMetadata } = coin.coinMetadata;
                return { ...coin, coinMetadata: restMetadata };
            }
            return coin;
        });
    } catch (error) {
        elizaLogger.error("Error fetching trending coins:", error);
        return [];
    }
}

function filterTrendingCoins(coins: CoinData[]): CoinData[] {
    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;

    const filteredCoins = coins
        .filter((coin) => {
            const timeCreated = parseInt(coin.timeCreated);
            const volume6h = parseFloat(coin.volume6h);
            return (
                !isNaN(timeCreated) &&
                timeCreated >= fourHoursAgo &&
                volume6h >= 10000
            );
        })
        .sort((a, b) => parseFloat(b.volume6h) - parseFloat(a.volume6h));

    // Take up to 3 coins if available, or all coins if less than 3
    const maxCoins = Math.min(filteredCoins.length, 3);
    return filteredCoins.slice(0, maxCoins);
}

export async function generateCoinAnalysisThread(
    runtime: IAgentRuntime,
    coins: CoinData[]
): Promise<string[]> {
    const context = `You are a crypto analyst creating an engaging and professional Twitter thread about newly created trending tokens. Write in a concise, informative style that resonates with crypto traders.

Token Data:
${coins
    .map(
        (coin, i) => `
${i + 1}. ${coin.coinMetadata.name} $${coin.coinMetadata.symbol}
- LP Burnt: ${coin.lpBurnt}
- Top 20 Holders: ${coin.top20HolderPercentage}%
- Honeypot: ${coin.isCoinHoneyPot}
- Liquidity: $${Math.round(coin.totalLiquidityUsd).toLocaleString()}
- 24h Volume: $${Math.round(parseFloat(coin.volume24h)).toLocaleString()}`
    )
    .join("\n")}

Create a Twitter thread that:
1. First tweet: Starts with a professional and engaging overview of the tokens analyzed.
   - Examples:
     - "Analyzing X newly created trending tokens in the last 4 hours: $SYMBOL, $SYMBOL, and $SYMBOL. Let’s examine their security metrics and assess potential risks."
     - "Breaking down X trending tokens created in the past 4 hours: $SYMBOL, $SYMBOL, and $SYMBOL. Here’s what the data reveals."
     - "Examining X newly created trending tokens: $SYMBOL, $SYMBOL, and $SYMBOL. Let’s assess their risks and metrics."

2. For each coin analysis:
   - Use varied transitions to maintain natural flow:
     - For the first coin:
       - "Let’s start with $SYMBOL—..."
       - "Beginning with $SYMBOL—..."
     - For middle coins:
       - "Next, let’s look at $SYMBOL—..."
       - "Now turning to $SYMBOL—..."
       - "Moving on to $SYMBOL—..."
     - For the last coin:
       - "Finally, $SYMBOL—..."
       - "Wrapping up with $SYMBOL—..."

   - Include key security metrics:
     - LP Status:
       - "The LP is burnt, reducing liquidity risks."
       - "The LP is not burnt, leaving liquidity vulnerable to removal."
     - Holder distribution:
       - "Top 20 holders control XX%, reflecting healthy distribution."
       - "Top 20 holders control XX%, indicating moderate centralization."
       - "Top 20 holders control XX%, signaling high centralization."
     - Honeypot status:
       - "No honeypot detected."
       - "Honeypot detected, posing significant risk."

   - End with a clear Risk Level and rationale:
     - "Risk Level: Low—metrics indicate a secure setup."
     - "Risk Level: Medium—centralization risk is notable."
     - "Risk Level: High—driven by liquidity and concentration risks."

   - Example analysis format:
     - "Let’s start with $SYMBOL—The LP is not burnt, leaving liquidity vulnerable to removal. Top 20 holders control XX%, reflecting moderate centralization. No honeypot detected. Risk Level: High, driven by liquidity vulnerability."

3. Final tweet:
   - Close with a professional disclaimer:
     - "Conduct thorough research before making investment decisions. This analysis is based on observed data and is not financial advice. DYOR. NFA."
     - "This thread is not financial advice. Always verify the data and make informed decisions. DYOR. NFA."

### Rules:
- Keep each tweet under 280 characters.
- Use professional, analytical language**—no emojis or decorative characters.
- **Never use parentheses around token symbols.
- Ensure each analysis is unique and engaging.
- Always classify unburnt LP as High Risk.
- Use varied transitions and phrasing to avoid repetition.
- "DYOR" only in the final tweet, along with "NFA."
- Avoid casual or overly conversational language. Stay concise and professional.
- The thread should flow naturally and read as a cohesive analysis.

Generate an array of tweets, where each element is a complete tweet, following this structured flow.`;

    const threadContentObject = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: ThreadSchema,
    });

    if (!isThreadContent(threadContentObject.object)) {
        elizaLogger.error(
            "Invalid thread content:",
            threadContentObject.object
        );
        return [];
    }

    return threadContentObject.object.tweets;
}

export async function composeTrendingCoinsThread(
    runtime: IAgentRuntime
): Promise<string[]> {
    const coins = await getTrendingCoins();
    const trendingCoins = filterTrendingCoins(coins);

    if (!trendingCoins.length) {
        return [];
    }

    return await generateCoinAnalysisThread(runtime, trendingCoins);
}

export async function postThread(
    runtime: IAgentRuntime,
    tweets: string[]
): Promise<boolean> {
    try {
        const twitterClient = runtime.clients.twitter?.client?.twitterClient;
        const scraper = twitterClient || new Scraper();

        if (!twitterClient) {
            const username = runtime.getSetting("TWITTER_USERNAME");
            const password = runtime.getSetting("TWITTER_PASSWORD");
            const email = runtime.getSetting("TWITTER_EMAIL");
            const twitter2faSecret = runtime.getSetting("TWITTER_2FA_SECRET");

            if (!username || !password) {
                elizaLogger.error("Twitter credentials not configured");
                return false;
            }

            await scraper.login(username, password, email, twitter2faSecret);
            if (!(await scraper.isLoggedIn())) {
                elizaLogger.error("Failed to login to Twitter");
                return false;
            }
        }

        let previousTweetId: string | undefined;

        // Post each tweet in the thread
        for (const tweet of tweets) {
            elizaLogger.log(`Posting tweet in thread: ${tweet}`);

            const result = await scraper.sendTweet(tweet, previousTweetId);
            const body = await result.json();

            if (body.errors) {
                const error = body.errors[0];
                elizaLogger.error(
                    `Twitter API error (${error.code}): ${error.message}`
                );
                return false;
            }

            // Extract the tweet ID from the response for the next reply
            previousTweetId =
                body?.data?.create_tweet?.tweet_results?.result?.rest_id;

            if (!previousTweetId) {
                elizaLogger.error("Failed to get tweet ID from response");
                return false;
            }

            // Add a small delay between tweets to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        return true;
    } catch (error) {
        elizaLogger.error("Error posting thread:", error);
        return false;
    }
}

export const postThreadAction: Action = {
    name: "POST_TRENDING_COINS_THREAD",
    description:
        "Posts a Twitter thread about trending coins (created <4h, volume >$15k). Direct client only.",
    similes: [
        "ANALYZE_TRENDING_COINS",
        "POST_COIN_ANALYSIS",
        "CREATE_TRENDING_ANALYSIS",
        "POST_NEW_COINS_ANALYSIS",
    ],
    suppressInitialMessage: true,
    validate: async (runtime: IAgentRuntime) => {
        // Check for direct client usage
        // if (message.content.source !== "direct") {
        //     elizaLogger.error(
        //         "POST_TRENDING_COINS_THREAD action can only be used from direct client"
        //     );
        //     return false;
        // }

        // Existing credential validation
        const username = runtime.getSetting("TWITTER_USERNAME");
        const password = runtime.getSetting("TWITTER_PASSWORD");
        const email = runtime.getSetting("TWITTER_EMAIL");
        const hasCredentials = !!username && !!password && !!email;
        elizaLogger.log(`Has credentials: ${hasCredentials}`);

        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        // Double-check for direct client usage
        if (message.content.source !== "direct") {
            elizaLogger.error(
                "POST_TRENDING_COINS_THREAD action can only be used from direct client"
            );
            return false;
        }

        try {
            const tweets = await composeTrendingCoinsThread(runtime);

            if (!tweets.length) {
                elizaLogger.error("No content generated for thread");
                return false;
            }

            elizaLogger.log(`Generated thread content:`, tweets);

            if (
                process.env.TWITTER_DRY_RUN &&
                process.env.TWITTER_DRY_RUN.toLowerCase() === "true"
            ) {
                elizaLogger.info(`Dry run: would have posted thread:`, tweets);
                return true;
            }

            return await postThread(runtime, tweets);
        } catch (error) {
            elizaLogger.error("Error in post thread action:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Create a thread about this" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a thread to explain this in detail.",
                    action: "POST_TRENDING_COINS_THREAD",
                },
            },
        ],
    ],
};

//*******************************GET SAFETY CHECK ACTION *******************************//
const API_KEY = "insidex_api.6WLT6sDeDbszNP77HfCW3ici";
const BASE_URL = "https://api-ex.insidex.trade/coins";

const getCoinMarketData = async (coinAddress: string) => {
    try {
        const response = await fetch(`${BASE_URL}/${coinAddress}/market-data`, {
            headers: {
                "x-api-key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const [data] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching coin market data:", error);
        throw error;
    }
};

export const getSafetyCheckHandler = async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    _callback: HandlerCallback
) => {
    // Extract complete SUI address using LLM
    const addressContext = `You are a SUI address extractor. Find and return ONLY the complete SUI address (format: 0x...::module::TICKER) from this message. If no valid SUI address is found, return "NONE". Message: ${_message.content.text}`;

    let coinAddress = await generateText({
        runtime: _runtime,
        context: addressContext,
        modelClass: ModelClass.SMALL,
        stop: ["\n"],
    });

    if (coinAddress === "NONE") {
        // const responseText =
        //     "Could you send me the CA so I unlock the truth behind this interesting project?";
        // _callback({ text: responseText } as Content);
        return false;
    }

    try {
        const marketData = await getCoinMarketData(coinAddress);

        const analysisContext = `You are a crypto analyst with a unique personality. Create a concise, engaging analysis of this token data. Keep it short but informative and formatted for quick reading.

IMPORTANT FORMATTING:
Start with a natural opener about $TICKER (vary between: "Hmm", "Interesting ticker", "Ahh", "Well, looking at", etc.).
Keep the analysis SHORT and FOCUSED – 2-3 key points max.
Only include these key metrics: LP Burnt, Top 20 Holders %, and Honeypot Risk.
Use concise, crypto-native language that resonates with degens.
Keep the first part under 200 characters.
Classify risk level based on LP Burnt, Top 20 Holders %, and Honeypot Risk.
End with a simple but effective DYOR message on the same line.

Risk Classification:
Low Risk: LP is burnt (no quick rug). Top 20 holders control ≤20% (well distributed). No honeypot detected.

Medium Risk: LP is burnt, but Top 20 holders control 21-50% (some centralization). No honeypot detected, but concentration raises concerns.

High Risk: LP not burnt (devs can rug). Top 20 holders control >50% (whale dominance). Honeypot detected (can't sell). Major red flags.
If two or more factors fall into a higher-risk category, classify the token at that risk level.

Example Openers You Can Use:
"Hmm, $TICKER—interesting setup..."
"Ahh, $TICKER—what do we have here?"
"Well, looking at $TICKER..."

Example of Ideal Length & Style:
Low Risk Example:
Looking at $NEONET—LP is burnt, so no quick rug. Top 20 holders control 22.27%, showing a balanced spread. No honeypot risk detected—solid setup. Free your mind and always DYOR.

Medium Risk Example:
Ahh, $VOID—LP is burnt, so no instant rug, but top 20 wallets control 42%. No honeypot risk, but centralization is real. Proceed with caution and always DYOR.

 High Risk Example:
Hmm, $RISKY—LP not burnt, so rug still possible. Top 20 holders hoarding 75%, and it’s a confirmed honeypot. High risk! Exit the simulation. Always DYOR.

Alternative Phrases You Can Use:
For wallet distribution: "wallet spread looks healthy", "holder distribution shows promise"
For security status: "security scan came back clean", "initial scan reveals no traps"
For recommendations: "worth watching", "showing potential"

Token Data:
Name: ${marketData.coinMetadata?.name}
Symbol: ${marketData.coinMetadata?.symbol}
LP Burnt: ${marketData.lpBurnt}
Top 20 Holders: ${marketData.top20HolderPercentage}%
Honeypot Risk: ${marketData.isCoinHoneyPot}`;

        let analysis = await generateText({
            runtime: _runtime,
            context: analysisContext,
            modelClass: ModelClass.LARGE,
            stop: ["\n\n\n"],
        });

        const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: analysis,
                action: "GET_SAFETY_CHECK_RESPONSE",
                source: _message.content?.source,
            } as Content,
        };
        await _runtime.getMemoryManager("");
        await _runtime.messageManager.createMemory(newMemory);
        _callback({
            text: analysis,
            action: "GET_SAFETY_CHECK_RESPONSE",
            source: _message.content?.source,
        } as Content);
        return true;
    } catch (error) {
        console.error("Error in safety check:", error);
        // const errorMessage =
        //     "Sorry, I couldn't fetch the market data at this time. Please make sure the SUI address is correct and try again.";
        // _callback({ text: errorMessage } as Content);
        return false;
    }
};
export const getSafetyCheckAction: Action = {
    name: "GET_SAFETY_CHECK",
    description: "Get safety check information for tokens on the SUI network",
    similes: [
        "TOKEN_SAFETY",
        "SAFETY_CHECK",
        "CHECK_TOKEN",
        "TOKEN_SECURITY",
        "VERIFY_TOKEN",
        "TOKEN_CHECK",
        "SECURITY_CHECK",
        "COIN_SAFETY",
        "CHECK_ANALYSIS",
        "ANALYSIS_CHECK",
        "ANALYSIS_SECURITY",
        "ANALYSIS_SAFETY",
        "ANALYSIS_CHECK_SECURITY",
        "ANALYSIS_CHECK_SAFETY",
        "ANALYSIS_CHECK_TOKEN",
        "ANALYSIS_CHECK_TOKEN_SECURITY",
        "COIN_ANALYSIS",
        "ANALYSIS_COIN",
        "ANALYSIS_COIN_SECURITY",
        "ANALYSIS_COIN_SAFETY",
        "ANALYSIS_COIN_CHECK_SECURITY",
        "ANALYSIS_COIN_CHECK_SAFETY",
        "ANALYSIS_COIN_CHECK_TOKEN",
    ],
    suppressInitialMessage: true,
    validate: async () => true,
    handler: getSafetyCheckHandler,
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's your analysis on this coin? 0x5ef78ed76602f11d4bd1689b1b8787f839eb2e31f97a2d8efc35d869770f2c23::mega::MEGA",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "[Analysis of security status and metrics]",
                    action: "GET_SAFETY_CHECK_RESPONSE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you verify if 0x2cd6f14a4b64c3a0fa9c644e8ed88d9c91d789a071886d67d24e6b435147063d::pugwif::PUGWIF is legitimate?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "[Analysis of security status and metrics].",
                    action: "GET_SAFETY_CHECK_RESPONSE",
                },
            },

            {
                user: "{{user1}}",
                content: {
                    text: "What about this coin? 0x5ef78ed76602f11d4bd1689b1b8787f839eb2e31f97a2d8efc35d869770f2c23::mega::MEGA",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "[Analysis of security status and metrics].",
                    action: "GET_SAFETY_CHECK_RESPONSE",
                },
            },
        ],
    ] as ActionExample[][],
};

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
    const waitTime =
        Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    return new Promise((resolve) => setTimeout(resolve, waitTime));
};

const logFetch = async (url: string, options: any) => {
    elizaLogger.debug(`Fetching ${url}`);
    // Disabled to avoid disclosure of sensitive information such as API keys
    // elizaLogger.debug(JSON.stringify(options, null, 2));
    return fetch(url, options);
};

export function parseArguments(): {
    character?: string;
    characters?: string;
} {
    try {
        return yargs(process.argv.slice(3))
            .option("character", {
                type: "string",
                description: "Path to the character JSON file",
            })
            .option("characters", {
                type: "string",
                description:
                    "Comma separated list of paths to character JSON files",
            })
            .parseSync();
    } catch (error) {
        elizaLogger.error("Error parsing arguments:", error);
        return {};
    }
}

function tryLoadFile(filePath: string): string | null {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (e) {
        return null;
    }
}
function mergeCharacters(base: Character, child: Character): Character {
    const mergeObjects = (baseObj: any, childObj: any) => {
        const result: any = {};
        const keys = new Set([
            ...Object.keys(baseObj || {}),
            ...Object.keys(childObj || {}),
        ]);
        keys.forEach((key) => {
            if (
                typeof baseObj[key] === "object" &&
                typeof childObj[key] === "object" &&
                !Array.isArray(baseObj[key]) &&
                !Array.isArray(childObj[key])
            ) {
                result[key] = mergeObjects(baseObj[key], childObj[key]);
            } else if (
                Array.isArray(baseObj[key]) ||
                Array.isArray(childObj[key])
            ) {
                result[key] = [
                    ...(baseObj[key] || []),
                    ...(childObj[key] || []),
                ];
            } else {
                result[key] =
                    childObj[key] !== undefined ? childObj[key] : baseObj[key];
            }
        });
        return result;
    };
    return mergeObjects(base, child);
}
async function loadCharacter(filePath: string): Promise<Character> {
    const content = tryLoadFile(filePath);
    if (!content) {
        throw new Error(`Character file not found: ${filePath}`);
    }
    let character = JSON.parse(content);
    validateCharacterConfig(character);

    // .id isn't really valid
    const characterId = character.id || character.name;
    const characterPrefix = `CHARACTER.${characterId.toUpperCase().replace(/ /g, "_")}.`;
    const characterSettings = Object.entries(process.env)
        .filter(([key]) => key.startsWith(characterPrefix))
        .reduce((settings, [key, value]) => {
            const settingKey = key.slice(characterPrefix.length);
            return { ...settings, [settingKey]: value };
        }, {});
    if (Object.keys(characterSettings).length > 0) {
        character.settings = character.settings || {};
        character.settings.secrets = {
            ...characterSettings,
            ...character.settings.secrets,
        };
    }
    // Handle plugins
    character.plugins = await handlePluginImporting(character.plugins);
    if (character.extends) {
        elizaLogger.info(
            `Merging  ${character.name} character with parent characters`
        );
        for (const extendPath of character.extends) {
            const baseCharacter = await loadCharacter(
                path.resolve(path.dirname(filePath), extendPath)
            );
            character = mergeCharacters(baseCharacter, character);
            elizaLogger.info(
                `Merged ${character.name} with ${baseCharacter.name}`
            );
        }
    }
    return character;
}

export async function loadCharacters(
    charactersArg: string
): Promise<Character[]> {
    let characterPaths = charactersArg
        ?.split(",")
        .map((filePath) => filePath.trim());
    const loadedCharacters: Character[] = [];

    if (characterPaths?.length > 0) {
        for (const characterPath of characterPaths) {
            let content: string | null = null;
            let resolvedPath = "";

            // Try different path resolutions in order
            const pathsToTry = [
                characterPath, // exact path as specified
                path.resolve(process.cwd(), characterPath), // relative to cwd
                path.resolve(process.cwd(), "agent", characterPath), // Add this
                path.resolve(__dirname, characterPath), // relative to current script
                path.resolve(
                    __dirname,
                    "characters",
                    path.basename(characterPath)
                ), // relative to agent/characters
                path.resolve(
                    __dirname,
                    "../characters",
                    path.basename(characterPath)
                ), // relative to characters dir from agent
                path.resolve(
                    __dirname,
                    "../../characters",
                    path.basename(characterPath)
                ), // relative to project root characters dir
            ];

            elizaLogger.info(
                "Trying paths:",
                pathsToTry.map((p) => ({
                    path: p,
                    exists: fs.existsSync(p),
                }))
            );

            for (const tryPath of pathsToTry) {
                content = tryLoadFile(tryPath);
                if (content !== null) {
                    resolvedPath = tryPath;
                    break;
                }
            }

            if (content === null) {
                elizaLogger.error(
                    `Error loading character from ${characterPath}: File not found in any of the expected locations`
                );
                elizaLogger.error("Tried the following paths:");
                pathsToTry.forEach((p) => elizaLogger.error(` - ${p}`));
                process.exit(1);
            }

            try {
                const character: Character = await loadCharacter(resolvedPath);

                loadedCharacters.push(character);
                elizaLogger.info(
                    `Successfully loaded character from: ${resolvedPath}`
                );
            } catch (e) {
                elizaLogger.error(
                    `Error parsing character from ${resolvedPath}: ${e}`
                );
                process.exit(1);
            }
        }
    }

    if (loadedCharacters.length === 0) {
        elizaLogger.info("No characters found, using default character");
        loadedCharacters.push(defaultCharacter);
    }

    return loadedCharacters;
}

async function handlePluginImporting(plugins: string[]) {
    if (plugins.length > 0) {
        elizaLogger.info("Plugins are: ", plugins);
        const importedPlugins = await Promise.all(
            plugins.map(async (plugin) => {
                try {
                    const importedPlugin = await import(plugin);
                    const functionName =
                        plugin
                            .replace("@elizaos/plugin-", "")
                            .replace(/-./g, (x) => x[1].toUpperCase()) +
                        "Plugin"; // Assumes plugin function is camelCased with Plugin suffix
                    return (
                        importedPlugin.default || importedPlugin[functionName]
                    );
                } catch (importError) {
                    elizaLogger.error(
                        `Failed to import plugin: ${plugin}`,
                        importError
                    );
                    return []; // Return null for failed imports
                }
            })
        );
        return importedPlugins;
    } else {
        return [];
    }
}

export function getTokenForProvider(
    provider: ModelProviderName,
    character: Character
): string | undefined {
    switch (provider) {
        // no key needed for llama_local or gaianet
        case ModelProviderName.LLAMALOCAL:
            return "";
        case ModelProviderName.OLLAMA:
            return "";
        case ModelProviderName.GAIANET:
            return "";
        case ModelProviderName.OPENAI:
            return (
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.ETERNALAI:
            return (
                character.settings?.secrets?.ETERNALAI_API_KEY ||
                settings.ETERNALAI_API_KEY
            );
        case ModelProviderName.NINETEEN_AI:
            return (
                character.settings?.secrets?.NINETEEN_AI_API_KEY ||
                settings.NINETEEN_AI_API_KEY
            );
        case ModelProviderName.LLAMACLOUD:
        case ModelProviderName.TOGETHER:
            return (
                character.settings?.secrets?.LLAMACLOUD_API_KEY ||
                settings.LLAMACLOUD_API_KEY ||
                character.settings?.secrets?.TOGETHER_API_KEY ||
                settings.TOGETHER_API_KEY ||
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.CLAUDE_VERTEX:
        case ModelProviderName.ANTHROPIC:
            return (
                character.settings?.secrets?.ANTHROPIC_API_KEY ||
                character.settings?.secrets?.CLAUDE_API_KEY ||
                settings.ANTHROPIC_API_KEY ||
                settings.CLAUDE_API_KEY
            );
        case ModelProviderName.REDPILL:
            return (
                character.settings?.secrets?.REDPILL_API_KEY ||
                settings.REDPILL_API_KEY
            );
        case ModelProviderName.OPENROUTER:
            return (
                character.settings?.secrets?.OPENROUTER ||
                settings.OPENROUTER_API_KEY
            );
        case ModelProviderName.GROK:
            return (
                character.settings?.secrets?.GROK_API_KEY ||
                settings.GROK_API_KEY
            );
        case ModelProviderName.HEURIST:
            return (
                character.settings?.secrets?.HEURIST_API_KEY ||
                settings.HEURIST_API_KEY
            );
        case ModelProviderName.GROQ:
            return (
                character.settings?.secrets?.GROQ_API_KEY ||
                settings.GROQ_API_KEY
            );
        case ModelProviderName.GALADRIEL:
            return (
                character.settings?.secrets?.GALADRIEL_API_KEY ||
                settings.GALADRIEL_API_KEY
            );
        case ModelProviderName.FAL:
            return (
                character.settings?.secrets?.FAL_API_KEY || settings.FAL_API_KEY
            );
        case ModelProviderName.ALI_BAILIAN:
            return (
                character.settings?.secrets?.ALI_BAILIAN_API_KEY ||
                settings.ALI_BAILIAN_API_KEY
            );
        case ModelProviderName.VOLENGINE:
            return (
                character.settings?.secrets?.VOLENGINE_API_KEY ||
                settings.VOLENGINE_API_KEY
            );
        case ModelProviderName.NANOGPT:
            return (
                character.settings?.secrets?.NANOGPT_API_KEY ||
                settings.NANOGPT_API_KEY
            );
        case ModelProviderName.HYPERBOLIC:
            return (
                character.settings?.secrets?.HYPERBOLIC_API_KEY ||
                settings.HYPERBOLIC_API_KEY
            );
        case ModelProviderName.VENICE:
            return (
                character.settings?.secrets?.VENICE_API_KEY ||
                settings.VENICE_API_KEY
            );
        case ModelProviderName.ATOMA:
            return (
                character.settings?.secrets?.ATOMASDK_BEARER_AUTH ||
                settings.ATOMASDK_BEARER_AUTH
            );
        case ModelProviderName.AKASH_CHAT_API:
            return (
                character.settings?.secrets?.AKASH_CHAT_API_KEY ||
                settings.AKASH_CHAT_API_KEY
            );
        case ModelProviderName.GOOGLE:
            return (
                character.settings?.secrets?.GOOGLE_GENERATIVE_AI_API_KEY ||
                settings.GOOGLE_GENERATIVE_AI_API_KEY
            );
        case ModelProviderName.MISTRAL:
            return (
                character.settings?.secrets?.MISTRAL_API_KEY ||
                settings.MISTRAL_API_KEY
            );
        case ModelProviderName.LETZAI:
            return (
                character.settings?.secrets?.LETZAI_API_KEY ||
                settings.LETZAI_API_KEY
            );
        case ModelProviderName.INFERA:
            return (
                character.settings?.secrets?.INFERA_API_KEY ||
                settings.INFERA_API_KEY
            );
        case ModelProviderName.DEEPSEEK:
            return (
                character.settings?.secrets?.DEEPSEEK_API_KEY ||
                settings.DEEPSEEK_API_KEY
            );
        default:
            const errorMessage = `Failed to get token - unsupported model provider: ${provider}`;
            elizaLogger.error(errorMessage);
            throw new Error(errorMessage);
    }
}

function initializeDatabase(dataDir: string) {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        elizaLogger.info("Initializing Supabase connection...");
        const db = new SupabaseDatabaseAdapter(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to Supabase database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to Supabase:", error);
            });

        return db;
    } else if (process.env.POSTGRES_URL) {
        elizaLogger.info("Initializing PostgreSQL connection...");
        const db = new PostgresDatabaseAdapter({
            connectionString: process.env.POSTGRES_URL,
            parseInputs: true,
        });

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to PostgreSQL database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to PostgreSQL:", error);
            });

        return db;
    } else if (process.env.PGLITE_DATA_DIR) {
        elizaLogger.info("Initializing PgLite adapter...");
        // `dataDir: memory://` for in memory pg
        const db = new PGLiteDatabaseAdapter({
            dataDir: process.env.PGLITE_DATA_DIR,
        });
        return db;
    } else {
        const filePath =
            process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
        elizaLogger.info(`Initializing SQLite database at ${filePath}...`);
        const db = new SqliteDatabaseAdapter(new Database(filePath));

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to SQLite database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to SQLite:", error);
            });

        return db;
    }
}

// also adds plugins from character file into the runtime
export async function initializeClients(
    character: Character,
    runtime: IAgentRuntime
) {
    // each client can only register once
    // and if we want two we can explicitly support it
    const clients: Record<string, any> = {};
    const clientTypes: string[] =
        character.clients?.map((str) => str.toLowerCase()) || [];
    elizaLogger.log("initializeClients", clientTypes, "for", character.name);

    // Start Auto Client if "auto" detected as a configured client
    if (clientTypes.includes(Clients.AUTO)) {
        const autoClient = await AutoClientInterface.start(runtime);
        if (autoClient) clients.auto = autoClient;
    }

    if (clientTypes.includes(Clients.DISCORD)) {
        const discordClient = await DiscordClientInterface.start(runtime);
        if (discordClient) clients.discord = discordClient;
    }

    if (clientTypes.includes(Clients.TELEGRAM)) {
        const telegramClient = await TelegramClientInterface.start(runtime);
        if (telegramClient) clients.telegram = telegramClient;
    }

    if (clientTypes.includes(Clients.TWITTER)) {
        const twitterClient = await TwitterClientInterface.start(runtime);
        if (twitterClient) {
            clients.twitter = twitterClient;
        }
    }

    if (clientTypes.includes(Clients.FARCASTER)) {
        // why is this one different :(
        const farcasterClient = new FarcasterAgentClient(runtime);
        if (farcasterClient) {
            farcasterClient.start();
            clients.farcaster = farcasterClient;
        }
    }
    if (clientTypes.includes("lens")) {
        const lensClient = new LensAgentClient(runtime);
        lensClient.start();
        clients.lens = lensClient;
    }

    elizaLogger.log("client keys", Object.keys(clients));

    // TODO: Add Slack client to the list
    // Initialize clients as an object

    if (clientTypes.includes("slack")) {
        const slackClient = await SlackClientInterface.start(runtime);
        if (slackClient) clients.slack = slackClient; // Use object property instead of push
    }

    function determineClientType(client: Client): string {
        // Check if client has a direct type identifier
        if ("type" in client) {
            return (client as any).type;
        }

        // Check constructor name
        const constructorName = client.constructor?.name;
        if (constructorName && !constructorName.includes("Object")) {
            return constructorName.toLowerCase().replace("client", "");
        }

        // Fallback: Generate a unique identifier
        return `client_${Date.now()}`;
    }

    if (character.plugins?.length > 0) {
        for (const plugin of character.plugins) {
            if (plugin.clients) {
                for (const client of plugin.clients) {
                    const startedClient = await client.start(runtime);
                    const clientType = determineClientType(client);
                    elizaLogger.debug(
                        `Initializing client of type: ${clientType}`
                    );
                    clients[clientType] = startedClient;
                }
            }
        }
    }

    return clients;
}

function getSecret(character: Character, secret: string) {
    return character.settings?.secrets?.[secret] || process.env[secret];
}

let nodePlugin: any | undefined;

export async function createAgent(
    character: Character,
    db: IDatabaseAdapter,
    cache: ICacheManager,
    token: string
): Promise<AgentRuntime> {
    elizaLogger.log(`Creating runtime for character ${character.name}`);

    nodePlugin ??= createNodePlugin();

    const teeMode = getSecret(character, "TEE_MODE") || "OFF";
    const walletSecretSalt = getSecret(character, "WALLET_SECRET_SALT");

    // Validate TEE configuration
    if (teeMode !== TEEMode.OFF && !walletSecretSalt) {
        elizaLogger.error(
            "WALLET_SECRET_SALT required when TEE_MODE is enabled"
        );
        throw new Error("Invalid TEE configuration");
    }

    let goatPlugin: any | undefined;

    if (getSecret(character, "EVM_PRIVATE_KEY")) {
        goatPlugin = await createGoatPlugin((secret) =>
            getSecret(character, secret)
        );
    }

    // Initialize Reclaim adapter if environment variables are present
    // let verifiableInferenceAdapter;
    // if (
    //     process.env.RECLAIM_APP_ID &&
    //     process.env.RECLAIM_APP_SECRET &&
    //     process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    // ) {
    //     verifiableInferenceAdapter = new ReclaimAdapter({
    //         appId: process.env.RECLAIM_APP_ID,
    //         appSecret: process.env.RECLAIM_APP_SECRET,
    //         modelProvider: character.modelProvider,
    //         token,
    //     });
    //     elizaLogger.log("Verifiable inference adapter initialized");
    // }
    // Initialize Opacity adapter if environment variables are present
    let verifiableInferenceAdapter;
    if (
        process.env.OPACITY_TEAM_ID &&
        process.env.OPACITY_CLOUDFLARE_NAME &&
        process.env.OPACITY_PROVER_URL &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new OpacityAdapter({
            teamId: process.env.OPACITY_TEAM_ID,
            teamName: process.env.OPACITY_CLOUDFLARE_NAME,
            opacityProverUrl: process.env.OPACITY_PROVER_URL,
            modelProvider: character.modelProvider,
            token: token,
        });
        elizaLogger.log("Verifiable inference adapter initialized");
        elizaLogger.log("teamId", process.env.OPACITY_TEAM_ID);
        elizaLogger.log("teamName", process.env.OPACITY_CLOUDFLARE_NAME);
        elizaLogger.log("opacityProverUrl", process.env.OPACITY_PROVER_URL);
        elizaLogger.log("modelProvider", character.modelProvider);
        elizaLogger.log("token", token);
    }
    if (
        process.env.PRIMUS_APP_ID &&
        process.env.PRIMUS_APP_SECRET &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new PrimusAdapter({
            appId: process.env.PRIMUS_APP_ID,
            appSecret: process.env.PRIMUS_APP_SECRET,
            attMode: "proxytls",
            modelProvider: character.modelProvider,
            token,
        });
        elizaLogger.log("Verifiable inference primus adapter initialized");
    }

    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        // character.plugins are handled when clients are added
        plugins: [
            bootstrapPlugin,
            getSecret(character, "CONFLUX_CORE_PRIVATE_KEY")
                ? confluxPlugin
                : null,
            nodePlugin,
            getSecret(character, "TAVILY_API_KEY") ? webSearchPlugin : null,
            getSecret(character, "SOLANA_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? solanaPlugin
                : null,
            getSecret(character, "SOLANA_PRIVATE_KEY")
                ? solanaAgentkitPlguin
                : null,
            getSecret(character, "AUTONOME_JWT_TOKEN") ? autonomePlugin : null,
            (getSecret(character, "NEAR_ADDRESS") ||
                getSecret(character, "NEAR_WALLET_PUBLIC_KEY")) &&
            getSecret(character, "NEAR_WALLET_SECRET_KEY")
                ? nearPlugin
                : null,
            getSecret(character, "EVM_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? evmPlugin
                : null,
            getSecret(character, "COSMOS_RECOVERY_PHRASE") &&
                getSecret(character, "COSMOS_AVAILABLE_CHAINS") &&
                createCosmosPlugin(),
            (getSecret(character, "SOLANA_PUBLIC_KEY") ||
                (getSecret(character, "WALLET_PUBLIC_KEY") &&
                    !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith(
                        "0x"
                    ))) &&
            getSecret(character, "SOLANA_ADMIN_PUBLIC_KEY") &&
            getSecret(character, "SOLANA_PRIVATE_KEY") &&
            getSecret(character, "SOLANA_ADMIN_PRIVATE_KEY")
                ? nftGenerationPlugin
                : null,
            getSecret(character, "ZEROG_PRIVATE_KEY") ? zgPlugin : null,
            getSecret(character, "COINMARKETCAP_API_KEY")
                ? coinmarketcapPlugin
                : null,
            getSecret(character, "COINBASE_COMMERCE_KEY")
                ? coinbaseCommercePlugin
                : null,
            getSecret(character, "FAL_API_KEY") ||
            getSecret(character, "OPENAI_API_KEY") ||
            getSecret(character, "VENICE_API_KEY") ||
            getSecret(character, "NINETEEN_AI_API_KEY") ||
            getSecret(character, "HEURIST_API_KEY") ||
            getSecret(character, "LIVEPEER_GATEWAY_URL")
                ? imageGenerationPlugin
                : null,
            getSecret(character, "FAL_API_KEY") ? ThreeDGenerationPlugin : null,
            ...(getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY")
                ? [
                      coinbaseMassPaymentsPlugin,
                      tradePlugin,
                      tokenContractPlugin,
                      advancedTradePlugin,
                  ]
                : []),
            ...(teeMode !== TEEMode.OFF && walletSecretSalt ? [teePlugin] : []),
            getSecret(character, "SGX") ? sgxPlugin : null,
            getSecret(character, "ENABLE_TEE_LOG") &&
            ((teeMode !== TEEMode.OFF && walletSecretSalt) ||
                getSecret(character, "SGX"))
                ? teeLogPlugin
                : null,
            getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY") &&
            getSecret(character, "COINBASE_NOTIFICATION_URI")
                ? webhookPlugin
                : null,
            goatPlugin,
            getSecret(character, "COINGECKO_API_KEY") ||
            getSecret(character, "COINGECKO_PRO_API_KEY")
                ? coingeckoPlugin
                : null,
            getSecret(character, "EVM_PROVIDER_URL") ? goatPlugin : null,
            getSecret(character, "ABSTRACT_PRIVATE_KEY")
                ? abstractPlugin
                : null,
            getSecret(character, "BINANCE_API_KEY") &&
            getSecret(character, "BINANCE_SECRET_KEY")
                ? binancePlugin
                : null,
            getSecret(character, "FLOW_ADDRESS") &&
            getSecret(character, "FLOW_PRIVATE_KEY")
                ? flowPlugin
                : null,
            getSecret(character, "LENS_ADDRESS") &&
            getSecret(character, "LENS_PRIVATE_KEY")
                ? lensPlugin
                : null,
            getSecret(character, "APTOS_PRIVATE_KEY") ? aptosPlugin : null,
            getSecret(character, "MVX_PRIVATE_KEY") ? multiversxPlugin : null,
            getSecret(character, "ZKSYNC_PRIVATE_KEY") ? zksyncEraPlugin : null,
            getSecret(character, "CRONOSZKEVM_PRIVATE_KEY")
                ? cronosZkEVMPlugin
                : null,
            getSecret(character, "TEE_MARLIN") ? teeMarlinPlugin : null,
            getSecret(character, "TON_PRIVATE_KEY") ? tonPlugin : null,
            getSecret(character, "THIRDWEB_SECRET_KEY") ? thirdwebPlugin : null,
            getSecret(character, "SUI_PRIVATE_KEY") ? suiPlugin : null,
            getSecret(character, "STORY_PRIVATE_KEY") ? storyPlugin : null,
            getSecret(character, "FUEL_PRIVATE_KEY") ? fuelPlugin : null,
            getSecret(character, "AVALANCHE_PRIVATE_KEY")
                ? avalanchePlugin
                : null,
            getSecret(character, "ECHOCHAMBERS_API_URL") &&
            getSecret(character, "ECHOCHAMBERS_API_KEY")
                ? echoChambersPlugin
                : null,
            getSecret(character, "LETZAI_API_KEY") ? letzAIPlugin : null,
            getSecret(character, "STARGAZE_ENDPOINT") ? stargazePlugin : null,
            getSecret(character, "GIPHY_API_KEY") ? giphyPlugin : null,
            getSecret(character, "GENLAYER_PRIVATE_KEY")
                ? genLayerPlugin
                : null,
            getSecret(character, "AVAIL_SEED") &&
            getSecret(character, "AVAIL_APP_ID")
                ? availPlugin
                : null,
            getSecret(character, "OPEN_WEATHER_API_KEY")
                ? openWeatherPlugin
                : null,
            getSecret(character, "OBSIDIAN_API_TOKEN") ? obsidianPlugin : null,
            getSecret(character, "ARTHERA_PRIVATE_KEY")?.startsWith("0x")
                ? artheraPlugin
                : null,
            getSecret(character, "ALLORA_API_KEY") ? alloraPlugin : null,
            getSecret(character, "HYPERLIQUID_PRIVATE_KEY")
                ? hyperliquidPlugin
                : null,
            getSecret(character, "HYPERLIQUID_TESTNET")
                ? hyperliquidPlugin
                : null,
            getSecret(character, "AKASH_MNEMONIC") &&
            getSecret(character, "AKASH_WALLET_ADDRESS")
                ? akashPlugin
                : null,
            getSecret(character, "QUAI_PRIVATE_KEY") ? quaiPlugin : null,
        ].filter(Boolean),
        providers: [],
        actions: [postThreadAction, getSafetyCheckAction],
        services: [],
        managers: [],
        cacheManager: cache,
        fetch: logFetch,
        verifiableInferenceAdapter,
    });
}

function initializeFsCache(baseDir: string, character: Character) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cacheDir = path.resolve(baseDir, character.id, "cache");

    const cache = new CacheManager(new FsCacheAdapter(cacheDir));
    return cache;
}

function initializeDbCache(character: Character, db: IDatabaseCacheAdapter) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cache = new CacheManager(new DbCacheAdapter(db, character.id));
    return cache;
}

function initializeCache(
    cacheStore: string,
    character: Character,
    baseDir?: string,
    db?: IDatabaseCacheAdapter
) {
    switch (cacheStore) {
        case CacheStore.REDIS:
            if (process.env.REDIS_URL) {
                elizaLogger.info("Connecting to Redis...");
                const redisClient = new RedisClient(process.env.REDIS_URL);
                if (!character?.id) {
                    throw new Error(
                        "CacheStore.REDIS requires id to be set in character definition"
                    );
                }
                return new CacheManager(
                    new DbCacheAdapter(redisClient, character.id) // Using DbCacheAdapter since RedisClient also implements IDatabaseCacheAdapter
                );
            } else {
                throw new Error("REDIS_URL environment variable is not set.");
            }

        case CacheStore.DATABASE:
            if (db) {
                elizaLogger.info("Using Database Cache...");
                return initializeDbCache(character, db);
            } else {
                throw new Error(
                    "Database adapter is not provided for CacheStore.Database."
                );
            }

        case CacheStore.FILESYSTEM:
            elizaLogger.info("Using File System Cache...");
            if (!baseDir) {
                throw new Error(
                    "baseDir must be provided for CacheStore.FILESYSTEM."
                );
            }
            return initializeFsCache(baseDir, character);

        default:
            throw new Error(
                `Invalid cache store: ${cacheStore} or required configuration missing.`
            );
    }
}

async function startAgent(
    character: Character,
    directClient: DirectClient
): Promise<AgentRuntime> {
    let db: IDatabaseAdapter & IDatabaseCacheAdapter;
    try {
        character.id ??= stringToUuid(character.name);
        character.username ??= character.name;

        const token = getTokenForProvider(character.modelProvider, character);
        const dataDir = path.join(__dirname, "../data");

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        db = initializeDatabase(dataDir) as IDatabaseAdapter &
            IDatabaseCacheAdapter;

        await db.init();

        const cache = initializeCache(
            process.env.CACHE_STORE ?? CacheStore.DATABASE,
            character,
            "",
            db
        ); // "" should be replaced with dir for file system caching. THOUGHTS: might probably make this into an env
        const runtime: AgentRuntime = await createAgent(
            character,
            db,
            cache,
            token
        );

        // start services/plugins/process knowledge
        await runtime.initialize();

        // start assigned clients
        runtime.clients = await initializeClients(character, runtime);

        // add to container
        directClient.registerAgent(runtime);

        // report to console
        elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

        return runtime;
    } catch (error) {
        elizaLogger.error(
            `Error starting agent for character ${character.name}:`,
            error
        );
        elizaLogger.error(error);
        if (db) {
            await db.close();
        }
        throw error;
    }
}

const checkPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close();
            resolve(true);
        });

        server.listen(port);
    });
};

const startAgents = async () => {
    const directClient = new DirectClient();
    let serverPort = parseInt(settings.SERVER_PORT || "3000");
    const args = parseArguments();
    let charactersArg = args.characters || args.character;
    let characters = [defaultCharacter];

    if (charactersArg) {
        characters = await loadCharacters(charactersArg);
    }

    try {
        for (const character of characters) {
            await startAgent(character, directClient);
        }
    } catch (error) {
        elizaLogger.error("Error starting agents:", error);
    }

    // Find available port
    while (!(await checkPortAvailable(serverPort))) {
        elizaLogger.warn(
            `Port ${serverPort} is in use, trying ${serverPort + 1}`
        );
        serverPort++;
    }

    // upload some agent functionality into directClient
    directClient.startAgent = async (character) => {
        // Handle plugins
        character.plugins = await handlePluginImporting(character.plugins);

        // wrap it so we don't have to inject directClient later
        return startAgent(character, directClient);
    };

    directClient.start(serverPort);

    if (serverPort !== parseInt(settings.SERVER_PORT || "3000")) {
        elizaLogger.log(`Server started on alternate port ${serverPort}`);
    }

    elizaLogger.log(
        "Run `pnpm start:client` to start the client and visit the outputted URL (http://localhost:5173) to chat with your agents. When running multiple agents, use client with different port `SERVER_PORT=3001 pnpm start:client`"
    );
};

startAgents().catch((error) => {
    elizaLogger.error("Unhandled error in startAgents:", error);
    process.exit(1);
});
