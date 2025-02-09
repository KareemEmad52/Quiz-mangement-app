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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./Routers/router"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const DB_connection_1 = require("./DB/DB.connection");
const errorHandler_1 = require("./middlewares/errorHandler");
const morgan_1 = __importDefault(require("morgan"));
// Load environment variables
dotenv_1.default.config();
// Validate required environment variables
if (!process.env.DBCONNECTION) {
    console.error("Missing required environment variable: DBCONNECTION");
    process.exit(1);
}
const PORT = +process.env.PORT || 3000;
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/v1", router_1.default);
// 404 Route Handler
app.all("*", (req, res, next) => {
    throw new errorHandler_1.AppError("Route not found", 404);
});
// Global Error Handler
app.use((err, req, res, next) => {
    const { status, stack, message } = err;
    res.status(status || 500).json(Object.assign({ status: "error", message }, (process.env.MODE === "development" && { stack })));
});
// Start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DB_connection_1.DB_CONNECTION)();
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
});
startServer()
    .then(() => {
    console.log("Server startup completed.");
})
    .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map