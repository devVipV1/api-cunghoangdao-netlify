// netlify/functions/index.js
exports.handler = async (event) => {
    const url = new URL(event.rawUrl);
    const path = url.pathname.toLowerCase();
    const p = url.searchParams;

    // ========== HOME ==========
    if (path === "/" || path === "/home") {
        return json({
            message: "Hướng dẫn API",
            endpoints: {
                "/cunghoangdao?date=16/02": "Xem cung hoàng đạo",
                "/duyen?name1=Nam&dob1=16/02/2009&name2=Nu&dob2=29/06/2009": "Xem độ hợp duyên",
                "/tarot?name=Nam&dob=16/02/2009": "Rút bài Tarot 78 lá chuẩn"
            }
        });
    }

    // ========== CUNG HOÀNG ĐẠO ==========
    if (path === "/cunghoangdao") {
        const date = p.get("date");
        if (!date) return json({ error: "Thiếu tham số: date" });

        const sign = zodiac(date);
        return json({ date, zodiac: sign });
    }

    // ========== DUYÊN ==========
    if (path === "/duyen") {
        const name1 = p.get("name1");
        const dob1 = p.get("dob1");
        const name2 = p.get("name2");
        const dob2 = p.get("dob2");

        if (!name1 || !dob1 || !name2 || !dob2)
            return json({ error: "Thiếu tham số name1, dob1, name2, dob2" });

        const percent = Math.floor(Math.random() * 41) + 60;

        return json({
            couple: `${name1} ❤ ${name2}`,
            percent: percent + "%",
            message: "Chỉ mang tính vui"
        });
    }

    // ========== TAROT 78 LÁ ==========
    if (path === "/tarot") {
        const name = p.get("name");
        const dob = p.get("dob");

        if (!name || !dob)
            return json({ error: "Thiếu tham số name, dob" });

        const card = tarot78[Math.floor(Math.random() * tarot78.length)];

        return json({
            name,
            dob,
            tarot: card.name,
            meaning: card.meaning
        });
    }

    return json({ error: "Sai endpoint" }, 404);
};

// ========== JSON RESPONSE ==========
function json(data, status = 200) {
    return {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2)
    };
}

// ========== CUNG HOÀNG ĐẠO ==========
function zodiac(dateStr) {
    const [day, month] = dateStr.split("/").map(Number);

    const ranges = [
        ["Ma Kết", 1, 19], ["Bảo Bình", 2, 18],
        ["Song Ngư", 3, 20], ["Bạch Dương", 4, 19],
        ["Kim Ngưu", 5, 20], ["Song Tử", 6, 21],
        ["Cự Giải", 7, 22], ["Sư Tử", 8, 22],
        ["Xử Nữ", 9, 22], ["Thiên Bình", 10, 23],
        ["Bọ Cạp", 11, 22], ["Nhân Mã", 12, 21],
        ["Ma Kết", 12, 31]
    ];

    for (const [sign, m, d] of ranges)
        if (month === m && day <= d) return sign;

    return "Không xác định";
}

// ========== 78 LÁ TAROT ==========
const tarot78 = [
    { name: "The Fool", meaning: "Khởi đầu mới, bước đi táo bạo." },
    { name: "The Magician", meaning: "Sáng tạo, làm chủ tình huống." },
    { name: "The High Priestess", meaning: "Trực giác mạnh mẽ, điều bí ẩn." },
    { name: "The Empress", meaning: "Tình yêu, sự nuôi dưỡng." },
    { name: "The Emperor", meaning: "Ổn định, kiểm soát." },
    { name: "The Hierophant", meaning: "Niềm tin, truyền thống." },
    { name: "The Lovers", meaning: "Tình duyên, sự lựa chọn." },
    { name: "The Chariot", meaning: "Quyết tâm, chiến thắng." },
    { name: "Strength", meaning: "Nội lực mạnh mẽ, kiên trì." },
    { name: "The Hermit", meaning: "Tĩnh lặng, suy ngẫm." },
    { name: "Wheel of Fortune", meaning: "Biến chuyển lớn." },
    { name: "Justice", meaning: "Công bằng, nhân quả." },
    { name: "The Hanged Man", meaning: "Nhìn sự việc theo hướng khác." },
    { name: "Death", meaning: "Kết thúc – bắt đầu mới." },
    { name: "Temperance", meaning: "Cân bằng, hài hòa." },
    { name: "The Devil", meaning: "Ràng buộc, cám dỗ." },
    { name: "The Tower", meaning: "Thay đổi đột ngột." },
    { name: "The Star", meaning: "Hi vọng, chữa lành." },
    { name: "The Moon", meaning: "Mơ hồ, lo lắng." },
    { name: "The Sun", meaning: "Hạnh phúc, thành công." },
    { name: "Judgement", meaning: "Thức tỉnh, quyết định lớn." },
    { name: "The World", meaning: "Hoàn tất, viên mãn." },

    // === 56 LÁ MINOR ARCANA ===
    // Wands
    ...[
        "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands",
        "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands",
        "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands",
        "Queen of Wands", "King of Wands"
    ].map(n => ({ name: n, meaning: "Năng lượng, hành động, đam mê." })),

    // Cups
    ...[
        "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups",
        "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups",
        "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups",
        "Queen of Cups", "King of Cups"
    ].map(n => ({ name: n, meaning: "Cảm xúc, tình yêu, kết nối." })),

    // Swords
    ...[
        "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords",
        "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords",
        "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords",
        "Queen of Swords", "King of Swords"
    ].map(n => ({ name: n, meaning: "Trí tuệ, quyết định, mâu thuẫn." })),

    // Pentacles
    ...[
        "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles",
        "Five of Pentacles", "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles",
        "Nine of Pentacles", "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles",
        "Queen of Pentacles", "King of Pentacles"
    ].map(n => ({ name: n, meaning: "Tiền bạc, công việc, thực tế." }))
];
