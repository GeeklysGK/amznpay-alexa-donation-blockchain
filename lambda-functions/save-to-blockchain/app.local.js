const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

process.env.IS_LOCAL = "true";

const app = require("./build/dist/app")
const port = 3001

app.default.listen(port);
console.info(`listening on http://localhost:${port}`)