const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { onTimeOut } = require("./bmpctapconsumer");

const PORT = 3001
app.use(bodyParser.json("application/json"));

//API for the testing purpose

app.get("/test", async (req, res) => {
    const consersation =  {"eventType":"Conversation","platform":"WA","accountNo":"94720290996","accountName":"ADA Business Messages ","data":{"id":"40cda0de-49f1-47a3-a405-692581acd61d","custNo":"60195698825","custName":"</pavan>","startTime":"2023-06-05 13:16:18","type":"service"}}
    const messageStatusFailed = {"eventType":"MessageStatus","platform":"WA","accountNo":"94720290996","accountName":"ADA Business Messages ","data":{"id":"511a881d-81a9-409a-b1cc-5fd27deee634","custNo":"60195698825","custName":"</pavan>","timestamp":"2023-06-05 13:15:47","status":"failed"}}
    const messageStatusSent = {"eventType":"MessageStatus","platform":"WA","accountNo":"94720290996","accountName":"ADA Business Messages ","data":{"id":"7d63c8a5-30b2-45fb-84ae-e547cc45a02d","custNo":"60195698825","custName":"</pavan>","timestamp":"2023-06-06 09:16:01","status":"sent"}}
    const messageStatusRead = {"eventType":"MessageStatus","platform":"WA","accountNo":"94720290996","accountName":"ADA Business Messages ","data":{"id":"e2ebad43-9e5d-483b-b53e-820cb1a9ffd0","custNo":"60195698825","custName":"</pavan>","timestamp":"2023-06-05 13:16:22","status":"read"}}
    const messageStatusDelivered = {"eventType":"MessageStatus","platform":"WA","accountNo":"94720290996","accountName":"ADA Business Messages ","data":{"id":"e2ebad43-9e5d-483b-b53e-820cb1a9ffd0","custNo":"60195698825","custName":"</pavan>","timestamp":"2023-06-05 13:16:22","status":"delivered"}}
    const strStr = JSON.stringify(messageStatusDelivered)
    console.log("msg = "+strStr)
    const payload = JSON.parse(strStr)
    payload["headers"] = {
        'Content-Type': "application/json",
        'Authorization': ""
    }
    onTimeOut(payload, "", "")
    res.send();
});

app.listen(PORT, () => {
    console.log("GCM collector listening at " + PORT)
})