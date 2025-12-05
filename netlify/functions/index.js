exports.handler = async (event) => {
    const url = new URL(event.rawUrl);
    const path = url.pathname.toLowerCase();
    const p = url.searchParams;

    // HOME
    if (path === "/" || path === "/home") {
        return json({
            api: "Tarot API v2 (no images)",
            endpoints: {
                "/tarot?name=&dob=": "Rút 1 lá Tarot",
                "/tarot3?name=&dob=": "3 lá Tarot QK–HT–TL",
                "/tarotlove?name=&dob=": "Tarot tình yêu",
                "/tarotcareer?name=&dob=": "Tarot công việc",
                "/cunghoangdao?date=": "Xem cung hoàng đạo",
                "/duyen?name1=&dob1=&name2=&dob2=": "Xem độ hợp duyên"
            }
        });
    }

    // TAROT 1 LÁ
    if (path === "/tarot") {
        const name = p.get("name");
        const dob = p.get("dob");
        if (!name || !dob) return json({ error: "Thiếu name, dob" });
        const result = drawOneCard();
        return json({ name, dob, ...result });
    }

    // TAROT 3 LÁ
    if (path === "/tarot3") {
        const name = p.get("name");
        const dob = p.get("dob");
        if (!name || !dob) return json({ error: "Thiếu name, dob" });

        return json({
            name,
            dob,
            past: drawOneCard(),
            present: drawOneCard(),
            future: drawOneCard()
        });
    }

    // TAROT LOVE
    if (path === "/tarotlove") {
        const name = p.get("name");
        const dob = p.get("dob");
        if (!name || !dob) return json({ error: "Thiếu name, dob" });

        const c = drawOneCard();
        return json({
            name,
            dob,
            card: c.card,
            position: c.position,
            meaning: c.meaning,
            love_message: loveMeaning(c.card, c.position)
        });
    }

    // TAROT CAREER
    if (path === "/tarotcareer") {
        const name = p.get("name");
        const dob = p.get("dob");
        if (!name || !dob) return json({ error: "Thiếu name, dob" });

        const c = drawOneCard();
        return json({
            name,
            dob,
            card: c.card,
            position: c.position,
            meaning: c.meaning,
            career_message: careerMeaning(c.card, c.position)
        });
    }

    // CUNG HOÀNG ĐẠO
    if (path === "/cunghoangdao") {
        const date = p.get("date");
        if (!date) return json({ error: "Thiếu date=dd/mm" });
        return json({ date, zodiac: zodiac(date) });
    }

    // DUYÊN
    if (path === "/duyen") {
        const name1 = p.get("name1");
        const dob1 = p.get("dob1");
        const name2 = p.get("name2");
        const dob2 = p.get("dob2");

        if (!name1 || !dob1 || !name2 || !dob2)
            return json({ error: "Thiếu name1, dob1, name2, dob2" });

        return json({
            couple: `${name1} ❤ ${name2}`,
            percent: Math.floor(Math.random() * 41) + 60,
            note: "Chỉ mang tính chất giải trí."
        });
    }

    return json({ error: "Endpoint không tồn tại" }, 404);
};
// JSON Helper
function json(data, status = 200) {
    return {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2)
    };
}

// Rút 1 lá Tarot
function drawOneCard() {
    const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const reversed = Math.random() < 0.5;
    return {
        card: card.name,
        position: reversed ? "reversed" : "upright",
        meaning: reversed ? card.reversed : card.upright
    };
}

// Nghĩa tình yêu
function loveMeaning(card, pos) {
    return `${card} (${pos}) cho thấy bạn cần lắng nghe cảm xúc thật sự, tránh nóng vội và tin tưởng hơn vào người mình yêu.`;
}

// Nghĩa công việc
function careerMeaning(card, pos) {
    return `${card} (${pos}) báo hiệu sự thay đổi trong công việc. Hãy kiên định và nỗ lực nhiều hơn để đạt thành quả.`;
}

// Cung hoàng đạo
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
const tarotCards = [
    { name: "The Fool", upright: "Khởi đầu mới.", reversed: "Liều lĩnh." },
    { name: "The Magician", upright: "Hành động.", reversed: "Lừa dối." },
    { name: "The High Priestess", upright: "Trực giác.", reversed: "Mơ hồ." },
    { name: "The Empress", upright: "Tình yêu.", reversed: "Phụ thuộc." },
    { name: "The Emperor", upright: "Ổn định.", reversed: "Cứng nhắc." },
    { name: "The Hierophant", upright: "Truyền thống.", reversed: "Phản kháng." },
    { name: "The Lovers", upright: "Sự lựa chọn.", reversed: "Mâu thuẫn." },
    { name: "The Chariot", upright: "Chiến thắng.", reversed: "Mất kiểm soát." },
    { name: "Strength", upright: "Dũng cảm.", reversed: "Yếu đuối." },
    { name: "The Hermit", upright: "Chiêm nghiệm.", reversed: "Cô lập." },
    { name: "Wheel of Fortune", upright: "May mắn.", reversed: "Xui xẻo." },
    { name: "Justice", upright: "Công bằng.", reversed: "Thiếu minh bạch." },
    { name: "The Hanged Man", upright: "Góc nhìn mới.", reversed: "Trì trệ." },
    { name: "Death", upright: "Tái sinh.", reversed: "Chống thay đổi." },
    { name: "Temperance", upright: "Cân bằng.", reversed: "Quá đà." },
    { name: "The Devil", upright: "Cám dỗ.", reversed: "Giải thoát." },
    { name: "The Tower", upright: "Biến cố.", reversed: "Từ chối thay đổi." },
    { name: "The Star", upright: "Hi vọng.", reversed: "Mất niềm tin." },
    { name: "The Moon", upright: "Ảo giác.", reversed: "Sáng tỏ." },
    { name: "The Sun", upright: "Hạnh phúc.", reversed: "Ảo tưởng." },
    { name: "Judgement", upright: "Thức tỉnh.", reversed: "Do dự." },
    { name: "The World", upright: "Hoàn thành.", reversed: "Trì hoãn." },
    // WANDS
    { name: "Ace of Wands", upright: "Khởi đầu.", reversed: "Trì trệ." },
    { name: "Two of Wands", upright: "Kế hoạch.", reversed: "Do dự." },
    { name: "Three of Wands", upright: "Tiến triển.", reversed: "Chậm trễ." },
    { name: "Four of Wands", upright: "Ăn mừng.", reversed: "Bất ổn." },
    { name: "Five of Wands", upright: "Xung đột.", reversed: "Tránh né." },
    { name: "Six of Wands", upright: "Thành công.", reversed: "Thất bại." },
    { name: "Seven of Wands", upright: "Bảo vệ.", reversed: "Mất nghiêm trọng." },
    { name: "Eight of Wands", upright: "Nhanh.", reversed: "Rối loạn." },
    { name: "Nine of Wands", upright: "Kiên trì.", reversed: "Kiệt sức." },
    { name: "Ten of Wands", upright: "Gánh nặng.", reversed: "Buông bỏ." },
    { name: "Page of Wands", upright: "Tin mới.", reversed: "Thiếu năng lượng." },
    { name: "Knight of Wands", upright: "Nhiệt huyết.", reversed: "Nóng nảy." },
    { name: "Queen of Wands", upright: "Quyến rũ.", reversed: "Ghen tuông." },
    { name: "King of Wands", upright: "Lãnh đạo.", reversed: "Kiêu ngạo." },

    // CUPS
    { name: "Ace of Cups", upright: "Tình yêu mới.", reversed: "Tắc nghẽn cảm xúc." },
    { name: "Two of Cups", upright: "Kết nối.", reversed: "Xa cách." },
    { name: "Three of Cups", upright: "Ăn mừng.", reversed: "Cãi vã." },
    { name: "Four of Cups", upright: "Chán nản.", reversed: "Nhận ra cơ hội." },
    { name: "Five of Cups", upright: "Mất mát.", reversed: "Hàn gắn." },
    { name: "Six of Cups", upright: "Hoài niệm.", reversed: "Mắc kẹt quá khứ." },
    { name: "Seven of Cups", upright: "Nhiều lựa chọn.", reversed: "Rõ ràng." },
    { name: "Eight of Cups", upright: "Rời đi.", reversed: "Do dự." },
    { name: "Nine of Cups", upright: "Mãn nguyện.", reversed: "Không đủ." },
    { name: "Ten of Cups", upright: "Hạnh phúc.", reversed: "Rạn nứt." },
    { name: "Page of Cups", upright: "Nhạy cảm.", reversed: "Ảo tưởng." },
    { name: "Knight of Cups", upright: "Lãng mạn.", reversed: "Mơ mộng." },
    { name: "Queen of Cups", upright: "Trực giác.", reversed: "Cảm xúc tiêu cực." },
    { name: "King of Cups", upright: "Điềm tĩnh.", reversed: "Lạnh lùng." },

    // SWORDS
    { name: "Ace of Swords", upright: "Ý tưởng.", reversed: "Mơ hồ." },
    { name: "Two of Swords", upright: "Bế tắc.", reversed: "Quyết định." },
    { name: "Three of Swords", upright: "Tổn thương.", reversed: "Chữa lành." },
    { name: "Four of Swords", upright: "Nghỉ ngơi.", reversed: "Căng thẳng." },
    { name: "Five of Swords", upright: "Tranh cãi.", reversed: "Giảng hòa." },
    { name: "Six of Swords", upright: "Rời bỏ.", reversed: "Bị kéo lại." },
    { name: "Seven of Swords", upright: "Lừa dối.", reversed: "Thú nhận." },
    { name: "Eight of Swords", upright: "Mắc kẹt.", reversed: "Thoát ra." },
    { name: "Nine of Swords", upright: "Lo âu.", reversed: "Bình phục." },
    { name: "Ten of Swords", upright: "Kết thúc.", reversed: "Hồi sinh." },
    { name: "Page of Swords", upright: "Quan sát.", reversed: "Tin đồn." },
    { name: "Knight of Swords", upright: "Nhanh nhẹn.", reversed: "Hấp tấp." },
    { name: "Queen of Swords", upright: "Lý trí.", reversed: "Lạnh lùng." },
    { name: "King of Swords", upright: "Minh bạch.", reversed: "Độc đoán." },

    // PENTACLES
    { name: "Ace of Pentacles", upright: "Cơ hội.", reversed: "Thất thoát." },
    { name: "Two of Pentacles", upright: "Cân bằng.", reversed: "Rối loạn." },
    { name: "Three of Pentacles", upright: "Hợp tác.", reversed: "Thiếu phối hợp." },
    { name: "Four of Pentacles", upright: "Giữ chặt.", reversed: "Buông bỏ." },
    { name: "Five of Pentacles", upright: "Khó khăn.", reversed: "Hi vọng." },
    { name: "Six of Pentacles", upright: "Cho – nhận.", reversed: "Bất công." },
    { name: "Seven of Pentacles", upright: "Kiên nhẫn.", reversed: "Nôn nóng." },
    { name: "Eight of Pentacles", upright: "Chăm chỉ.", reversed: "Thiếu tập trung." },
    { name: "Nine of Pentacles", upright: "Độc lập.", reversed: "Phụ thuộc." },
    { name: "Ten of Pentacles", upright: "Gia đình.", reversed: "Rạn nứt." },
    { name: "Page of Pentacles", upright: "Học hỏi.", reversed: "Lười biếng." },
    { name: "Knight of Pentacles", upright: "Kiên trì.", reversed: "Chậm chạp." },
    { name: "Queen of Pentacles", upright: "Chu đáo.", reversed: "Kiểm soát." },
    { name: "King of Pentacles", upright: "Giàu có.", reversed: "Tham lam." }
];
