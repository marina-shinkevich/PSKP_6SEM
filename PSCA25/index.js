const express = require('express');
const app = express();

app.use((req, res, next) => {
    express.json()(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                jsonrpc: "2.0",
                error: { code: -32700, message: "Parse error" },
                id: null
            });
        }
        next();
    });
});

function executeMethod(method, params) {
    switch (method) {
        case "sum":
            if (!Array.isArray(params)) throw new Error("params must be an array");
            return params.reduce((acc, val) => acc + val, 0);

        case "mul":
            if (!Array.isArray(params)) throw new Error("params must be an array");
            return params.reduce((acc, val) => acc * val, 1);

        case "div":
            if (!Array.isArray(params) || params.length !== 2) throw new Error("params must be an array of 2 numbers");
            if (params[1] === 0) throw new Error("division by zero");
            return params[0] / params[1];

        case "proc":
            if (!Array.isArray(params) || params.length !== 2) throw new Error("params must be an array of 2 numbers");
            if (params[1] === 0) throw new Error("division by zero");
            return (params[0] / params[1]) * 100;

        default:
            throw { code: -32601, message: "Method not found" };
    }
}

function processRpcRequest(req) {
    if (!req || typeof req !== 'object' || req.jsonrpc !== "2.0") {
        return { jsonrpc: "2.0", error: { code: -32600, message: "Invalid Request" }, id: req?.id ?? null };
    }

    const { method, params = [], id } = req;
    const isNotification = !('id' in req) || id === null;

    if (typeof method !== 'string') {
        return { jsonrpc: "2.0", error: { code: -32600, message: "Invalid Request" }, id };
    }

    try {
        const result = executeMethod(method, params);
        if (isNotification) return null;
        return { jsonrpc: "2.0", result, id };
    } catch (err) {
        if (isNotification) return null;
        const code = err.code || -32602;
        return { jsonrpc: "2.0", error: { code, message: err.message }, id };
    }
}

app.post('/jsonrpc', (req, res) => {
    const data = req.body;

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return res.status(400).json({
                jsonrpc: "2.0",
                error: { code: -32600, message: "Invalid Request" },
                id: null
            });
        }
        const responses = data.map(processRpcRequest).filter(r => r !== null);
        if (responses.length === 0) return res.status(204).end();
        return res.json(responses);
    }


    if (typeof data !== 'object' || data === null) {
        return res.status(400).json({
            jsonrpc: "2.0",
            error: { code: -32600, message: "Invalid Request" },
            id: null
        });
    }

    const response = processRpcRequest(data);
    if (response === null) return res.status(204).end();
    res.json(response);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}/jsonrpc`);
});