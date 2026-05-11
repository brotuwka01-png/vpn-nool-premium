const express = require("express")
const TelegramBot = require("node-telegram-bot-api")

const app = express()

const TOKEN = process.env.BOT_TOKEN
const ADMIN_ID = process.env.ADMIN_ID

const bot = new TelegramBot(TOKEN, { polling: true })

let users = []
let logs = []
let orders = []

function addUser(user) {

if (!users.find(u => u.id === user.id)) {

users.push({
id: user.id,
username: user.username || "no_username",
status: "ONLINE",
plan: "FREE"
})

}

}

function addLog(username, text) {

logs.unshift({
username: username || "no_username",
text: text,
time: new Date().toLocaleTimeString()
})

if (logs.length > 20) {
logs.pop()
}

}

bot.onText(/\/start/, (msg) => {

addUser(msg.from)

addLog(msg.from.username, "зашел в бота")

bot.sendMessage(msg.chat.id,

`👋 Добро пожаловать в VPN NOOL PREMIUM

🚀 Быстрый и стабильный VPN

📱 Инструкция:

1️⃣ Скачайте Happ
2️⃣ Получите VPN ключ
3️⃣ Откройте Happ
4️⃣ Нажмите "Выбрать из буфера"
5️⃣ Подключитесь к серверу

⚡ Лучшие сервера:
🇩🇪 Germany
🇳🇱 Netherlands`,
{
reply_markup: {
keyboard: [
["💳 Купить VPN"],
["🛠 Поддержка"]
],
resize_keyboard: true
}
})

})

bot.on("message", (msg) => {

if (!msg.text) return

addUser(msg.from)

if (msg.text === "💳 Купить VPN") {

addLog(msg.from.username, "открыл тарифы")

bot.sendMessage(msg.chat.id,

`💎 Тарифы VPN NOOL PREMIUM

📅 1 Месяц — 399₽
📅 3 Месяца — 899₽
📅 12 Месяцев — 2999₽`,
{
reply_markup: {
keyboard: [
["📅 1 Месяц"],
["📅 3 Месяца"],
["📅 12 Месяцев"],
["⬅ Назад"]
],
resize_keyboard: true
}
})

}

if (
msg.text === "📅 1 Месяц" ||
msg.text === "📅 3 Месяца" ||
msg.text === "📅 12 Месяцев"
) {

orders.unshift({
id: msg.from.id,
username: msg.from.username || "no_username",
plan: msg.text
})

addLog(msg.from.username, "создал заявку")

bot.sendMessage(msg.chat.id,

`✅ Заявка создана

👑 Для оплаты напишите:
@SIKI_OFFICIAL

🆔 Ваш ID:
${msg.from.id}

⚡ После оплаты вам выдадут VPN ключ`
)

bot.sendMessage(ADMIN_ID,

`🚨 НОВАЯ ЗАЯВКА

👤 @${msg.from.username}

🆔 ID: ${msg.from.id}

💎 Тариф:
${msg.text}`
)

}

if (msg.text === "🛠 Поддержка") {

addLog(msg.from.username, "открыл поддержку")

bot.sendMessage(msg.chat.id,

`🛠 Поддержка VPN NOOL

👑 Владелец:
@SIKI_OFFICIAL`
)

}

if (msg.text === "⬅ Назад") {

bot.sendMessage(msg.chat.id,

`🏠 Главное меню`,
{
reply_markup: {
keyboard: [
["💳 Купить VPN"],
["🛠 Поддержка"]
],
resize_keyboard: true
}
})

}

})

app.get("/", (req,res) => {

res.send(`

<!DOCTYPE html>
<html lang="ru">

<head>

<meta charset="UTF-8">

<meta http-equiv="refresh" content="2">

<title>VPN NOOL PREMIUM</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:sans-serif;
}

body{
background:#050510;
color:white;
overflow-x:hidden;
}

.sidebar{
position:fixed;
left:0;
top:0;
width:260px;
height:100vh;
background:#0d0d18;
border-right:1px solid #6d28d9;
padding:25px;
}

.logo{
font-size:32px;
font-weight:900;
color:#a855f7;
text-shadow:0 0 20px #a855f7;
margin-bottom:40px;
}

.menu button{
width:100%;
margin-bottom:15px;
padding:15px;
border:none;
border-radius:15px;
background:#151526;
color:white;
font-size:16px;
cursor:pointer;
}

.main{
margin-left:260px;
padding:30px;
}

.topbar{
display:flex;
justify-content:space-between;
margin-bottom:30px;
}

.status{
color:#00ff88;
font-weight:bold;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:20px;
}

.card{
background:#111122;
padding:25px;
border-radius:25px;
border:1px solid #7e22ce;
}

.big{
font-size:42px;
font-weight:900;
color:#c084fc;
margin-top:10px;
}

.logs{
margin-top:30px;
background:#111122;
padding:25px;
border-radius:25px;
border:1px solid #7e22ce;
}

.log{
padding:12px;
border-bottom:1px solid #222;
}

.user{
color:#c084fc;
font-weight:bold;
}

.table{
margin-top:30px;
background:#111122;
padding:25px;
border-radius:25px;
border:1px solid #7e22ce;
}

table{
width:100%;
border-collapse:collapse;
}

th,td{
padding:15px;
text-align:left;
border-bottom:1px solid #222;
}

th{
color:#a855f7;
}

.online{
color:#00ff88;
font-weight:bold;
}

</style>

</head>

<body>

<div class="sidebar">

<div class="logo">
VPN NOOL
</div>

<div class="menu">

<button>📊 Dashboard</button>
<button>👥 Пользователи</button>
<button>💳 Подписки</button>
<button>📨 Заявки</button>
<button>⚙ Настройки</button>

</div>

</div>

<div class="main">

<div class="topbar">

<h1>ADMIN PANEL</h1>

<div class="status">
● SYSTEM ONLINE
</div>

</div>

<div class="grid">

<div class="card">
<h2>Пользователи</h2>
<div class="big">${users.length}</div>
</div>

<div class="card">
<h2>Заявки</h2>
<div class="big">${orders.length}</div>
</div>

<div class="card">
<h2>Онлайн</h2>
<div class="big">${users.length}</div>
</div>

<div class="card">
<h2>Доход</h2>
<div class="big">${orders.length * 399} ₽</div>
</div>

</div>

<div class="logs">

<h1 style="margin-bottom:20px;">LIVE ACTIVITY</h1>

${logs.map(log => `
<div class="log">
<span class="user">@${log.username}</span>
— ${log.text}
</div>
`).join("")}

</div>

<div class="table">

<h1 style="margin-bottom:20px;">
ПОСЛЕДНИЕ ПОЛЬЗОВАТЕЛИ
</h1>

<table>

<tr>
<th>ID</th>
<th>USERNAME</th>
<th>STATUS</th>
<th>PLAN</th>
</tr>

${users.map(user => `
<tr>
<td>${user.id}</td>
<td>@${user.username}</td>
<td class="online">${user.status}</td>
<td>${user.plan}</td>
</tr>
`).join("")}

</table>

</div>

</div>

</body>
</html>

`)

})

app.listen(3000, () => {
console.log("VPN NOOL PREMIUM STARTED")
})
