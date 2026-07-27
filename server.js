const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Папка со статикой

// Эндпоинт для сохранения списка пользователей в текстовый файл
app.post('/api/save-users', (req, res) => {
    const { users } = req.body;

    if (!users || !Array.isArray(users)) {
        return res.status(400).json({ error: 'Неверный формат данных' });
    }

    // Формируем красивый текст для файла
    let fileContent = `=== СПИСОК ЗАРЕГИСТРИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ===\n`;
    fileContent += `Дата обновления: ${new Date().toLocaleString('ru-RU')}\n`;
    fileContent += `Всего пользователей: ${users.length}\n`;
    fileContent += `--------------------------------------------------\n\n`;

    users.forEach((u, index) => {
        fileContent += `${index + 1}. Никнейм: ${u.username}\n`;
        fileContent += `   Дата/Статус: ${u.isCreator ? '👑 СОЗДАТЕЛЬ' : 'Пользователь'}\n`;
        fileContent += `   IP: ${u.ip || 'Не указан'}\n`;
        fileContent += `   Device ID: ${u.deviceId || 'Не указан'}\n`;
        fileContent += `--------------------------------------------------\n`;
    });

    // Записываем файл registered_users.txt в папку проекта
    const filePath = path.join(__dirname, 'registered_users.txt');
    
    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи файла:', err);
            return res.status(500).json({ error: 'Ошибка сохранения файла на сервере' });
        }
        console.log('📄 Файл registered_users.txt успешно обновлен!');
        res.json({ success: true, message: 'Файл успешно сохранен на сервере!' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
