export default {
    requestLibPath: "import request from '@/libs/request';",
    schemaPath: "http://localhost:8100/api/v3/api-docs",
    authorization: "Basic " + Buffer.from("admin:admin123").toString("base64"),
    serversPath: "./src",
};
