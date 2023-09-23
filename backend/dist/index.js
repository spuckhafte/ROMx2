import EVaultChain from "./helpers/EVaultChain.js";
import { Plugboard } from "plugboard.io";
export const EVault = new EVaultChain();
const plugboard = new Plugboard('dist/sockets', {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7,
});
plugboard.start(3000, () => console.log('[server started]'));
