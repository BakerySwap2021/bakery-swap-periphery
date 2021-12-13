"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixture = void 0;
var ethers_1 = require("ethers");
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./utilities");
var BakerySwapFactory_json_1 = __importDefault(require("@TokenClub2017/bc-swap-core/build/BakerySwapFactory.json"));
var IBakerySwapPair_json_1 = __importDefault(require("@TokenClub2017/bc-swap-core/build/IBakerySwapPair.json"));
var BEP20_json_1 = __importDefault(require("../../build/BEP20.json"));
var WBNB_json_1 = __importDefault(require("../../build/WBNB.json"));
var BakerySwapRouter_json_1 = __importDefault(require("../../build/BakerySwapRouter.json"));
var RouterEventEmitter_json_1 = __importDefault(require("../../build/RouterEventEmitter.json"));
var overrides = {
    gasLimit: 9999999
};
function Fixture(provider, _a) {
    var wallet = _a[0];
    return __awaiter(this, void 0, void 0, function () {
        var tokenA, tokenB, wbnb, wbnbPartner, factory, router, routerEventEmitter, pairAddress, pair, token0Address, token0, token1, wbnbPairAddress, wbnbPair;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, BEP20_json_1.default, [utilities_1.expandTo18Decimals(10000)])];
                case 1:
                    tokenA = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, BEP20_json_1.default, [utilities_1.expandTo18Decimals(10000)])];
                case 2:
                    tokenB = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, WBNB_json_1.default)];
                case 3:
                    wbnb = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, BEP20_json_1.default, [utilities_1.expandTo18Decimals(10000)])
                        // deploy factory
                    ];
                case 4:
                    wbnbPartner = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, BakerySwapFactory_json_1.default, [wallet.address])
                        // deploy routers
                    ];
                case 5:
                    factory = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, BakerySwapRouter_json_1.default, [factory.address, wbnb.address], overrides)
                        // event emitter for testing
                    ];
                case 6:
                    router = _b.sent();
                    return [4 /*yield*/, ethereum_waffle_1.deployContract(wallet, RouterEventEmitter_json_1.default, [])
                        // initialize
                    ];
                case 7:
                    routerEventEmitter = _b.sent();
                    // initialize
                    return [4 /*yield*/, factory.createPair(tokenA.address, tokenB.address)];
                case 8:
                    // initialize
                    _b.sent();
                    return [4 /*yield*/, factory.getPair(tokenA.address, tokenB.address)];
                case 9:
                    pairAddress = _b.sent();
                    pair = new ethers_1.Contract(pairAddress, JSON.stringify(IBakerySwapPair_json_1.default.abi), provider).connect(wallet);
                    return [4 /*yield*/, pair.token0()];
                case 10:
                    token0Address = _b.sent();
                    token0 = tokenA.address === token0Address ? tokenA : tokenB;
                    token1 = tokenA.address === token0Address ? tokenB : tokenA;
                    return [4 /*yield*/, factory.createPair(wbnb.address, wbnbPartner.address)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, factory.getPair(wbnb.address, wbnbPartner.address)];
                case 12:
                    wbnbPairAddress = _b.sent();
                    wbnbPair = new ethers_1.Contract(wbnbPairAddress, JSON.stringify(IBakerySwapPair_json_1.default.abi), provider).connect(wallet);
                    return [2 /*return*/, {
                            token0: token0,
                            token1: token1,
                            wbnb: wbnb,
                            wbnbPartner: wbnbPartner,
                            factory: factory,
                            router: router,
                            routerEventEmitter: routerEventEmitter,
                            pair: pair,
                            wbnbPair: wbnbPair
                        }];
            }
        });
    });
}
exports.Fixture = Fixture;
