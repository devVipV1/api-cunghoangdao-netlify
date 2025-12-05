exports.handler = async (event) => {
    const url = new URL(event.rawUrl);
    const path = url.pathname.toLowerCase();
    const p = url.searchParams;

    // ========== HOME ==========
    if (path === "/" || path === "/home") {
        return json({
            api: "Tarot API v2 (no images)",
            endpoints: {
                "/tarot?name=&dob=": "Rút 1 lá Tarot chung",
                "/tarot3?name=&dob=": "3 lá: Quá khứ – Hiện tại – Tương lai",
                "/tarotlove?name=&dob=": "Tarot tình yêu",
                "/tarotcareer?name=&dob=": "Tarot công việc",
                "/cunghoangdao?date=": "Xem cung hoàng đạo",
                "/duyen?name1=&dob1=&name2=&dob2=": "Xem độ hợp duyên"
            }
        });
    }
    // ========== 1 LÁ TAROT ==========
    if (path === "/tarot") {
        const name = p.get("name");
        const dob = p.get("dob");
        if (!name || !dob) return json({ error: "Thiếu name, dob" });

        const result = drawOneCard();
        return json({ name, dob, ...result });
    }

    // ========== 3 LÁ TAROT ==========
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

    // ========== TAROT LOVE ==========
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

    // ========== TAROT CAREER ==========
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
    // ========== CUNG HOÀNG ĐẠO ==========
    if (path === "/cunghoangdao") {
        const date = p.get("date");
        if (!date) return json({ error: "Thiếu date=dd/mm" });
        return json({ date, zodiac: zodiac(date) });
    }

    // ========== DUYÊN ==========
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


// ===== JSON helper =====
function json(data, status = 200) {
    return {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2)
    };
}


// ===== RANDOM TAROT =====
function drawOneCard() {
    const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const reversed = Math.random() < 0.5;
    return {
        card: card.name,
        position: reversed ? "reversed" : "upright",
        meaning: reversed ? card.reversed : card.upright
    };
}


// ===== LOVE INTERPRETATION =====
function loveMeaning(card, pos) {
    return `${card} (${pos}) cho thấy tình yêu của bạn đang cần sự chân thành, lắng nghe và thấu hiểu nhiều hơn.`;
}


// ===== CAREER INTERPRETATION =====
function careerMeaning(card, pos) {
    return `${card} (${pos}) cho thấy sự thay đổi hoặc cơ hội trong công việc – nhưng cần kiên định để đạt được kết quả tốt.`;
}
const tarotCards = [
    { name: "The Fool", upright: "Khởi đầu mới.", reversed: "Liều lĩnh." },
    { name: "The Magician", upright: "Hành động, sáng tạo.", reversed: "Lừa dối." },
    { name: "The High Priestess", upright: "Trực giác.", reversed: "Thiếu rõ ràng." },
    { name: "The Empress", upright: "Tình yêu, nuôi dưỡng.", reversed: "Phụ thuộc." },
    { name: "The Emperor", upright: "Ổn định.", reversed: "Cứng nhắc." },
    { name: "The Hierophant", upright: "Truyền thống.", reversed: "Nổi loạn." },
    { name: "The Lovers", upright: "Lựa chọn.", reversed: "Mâu thuẫn." },
    { name: "The Chariot", upright: "Quyết tâm.", reversed: "Mất kiểm soát." },
    { name: "Strength", upright: "Dũng cảm.", reversed: "Yếu đuối." },
    { name: "The Hermit", upright: "Chiêm nghiệm.", reversed: "Cô lập." },
    { name: "Wheel of Fortune", upright: "May mắn.", reversed: "Trở ngại." },
    { name: "Justice", upright: "Công bằng.", reversed: "Thiếu công bằng." },
    { name: "The Hanged Man", upright: "Góc nhìn mới.", reversed: "Trì trệ." },
    { name: "Death", upright: "Tái sinh.", reversed: "Chống thay đổi." },
    { name: "Temperance", upright: "Cân bằng.", reversed: "Quá đà." },
    { name: "The Devil", upright: "Cám dỗ.", reversed: "Giải thoát." },
    { name: "The Tower", upright: "Biến cố.", reversed: "Tránh thay đổi." },
    { name: "The Star", upright: "Hi vọng.", reversed: "Nghi ngờ." },
    { name: "The Moon", upright: "Ảo giác.", reversed: "Sáng tỏ." },
    { name: "The Sun", upright: "Thành công.", reversed: "Ảo tưởng." },
    { name: "Judgement", upright: "Thức tỉnh.", reversed: "Do dự." },
    { name: "The World", upright: "Hoàn thành.", reversed: "Chưa xong." },
    { name: "Ace of Wands", upright: "Khởi đầu.", reversed: "Trì trệ." },
    { name: "Two of Wands", upright: "Kế hoạch.", reversed: "Lo lắng." },
    { name: "Three of Wands", upright: "Tiến triển.", reversed: "Chậm trễ." },
    { name: "Four of Wands", upright: "Ăn mừng.", reversed: "Bất ổn." },
    { name: "Five of Wands", upright: "Xung đột.", reversed: "Tránh né." },
    { name: "Six of Wands", upright: "Chiến thắng.", reversed: "Thất bại." },
    { name: "Seven of Wands", upright: "Bảo vệ.", reversed: "Mất kiểm soát." },
    { name: "Eight of Wands", upright: "Nhanh.", reversed: "Rối loạn." },
    { name: "Nine of Wands", upright: "Kiên trì.", reversed: "Mệt mỏi." },
    { name: "Ten of Wands", upright: "Gánh nặng.", reversed: "Buông bỏ." },
    { name: "Page of Wands", upright: "Tin vui.", reversed: "Thiếu động lực." },
    { name: "Knight of Wands", upright: "Hành động.", reversed: "Nóng nảy." },
    { name: "Queen of Wands", upright: "Nhiệt huyết.", reversed: "Ghen tuông." },
    { name: "King of Wands", upright: "Lãnh đạo.", reversed: "Kiêu ngạo." },
    { name: "Ace of Cups", upright: "Tình yêu mới.", reversed: "Tắc nghẽn." },
    { name: "Two of Cups", upright: "Kết nối.", reversed: "Chia ly." },
    { name: "Three of Cups", upright: "Ăn mừng.", reversed: "Xa cách." },
    { name: "Four of Cups", upright: "Chán nản.", reversed: "Nhận ra cơ hội." },
    { name: "Five of Cups", upright: "Mất mát.", reversed: "Hàn gắn." },
    { name: "Six of Cups", upright: "Hoài niệm.", reversed: "Quá khứ níu giữ." },
    { name: "Seven of Cups", upright: "Nhiều lựa chọn.", reversed: "Rõ ràng." },
    { name: "Eight of Cups", upright: "Rời đi.", reversed: "Quay lại." },
    { name: "Nine of Cups", upright: "Ước muốn.", reversed: "Không thỏa mãn." },
    { name: "Ten of Cups", upright: "Hạnh phúc.", reversed: "Rạn nứt." },
    { name: "Page of Cups", upright: "Nhạy cảm.", reversed: "Ảo tưởng." },
    { name: "Knight of Cups", upright: "Lãng mạn.", reversed: "Hão huyền." },
    { name: "Queen of Cups", upright: "Trực giác.", reversed: "Cảm xúc tiêu cực." },
    { name: "King of Cups", upright: "Điềm tĩnh.", reversed: "Lạnh nhạt." },
    // SWORDS
    { name: "Ace of Swords", upright: "Ý tưởng.", reversed: "Mơ hồ." },
    { name: "Two of Swords", upright: "Bế tắc.", reversed: "Quyết định." },
    { name: "Three of Swords", upright: "Tổn thương.", reversed: "Chữa lành." },
    { name: "Four of Swords", upright: "Nghỉ ngơi.", reversed: "Căng thẳng." },
    { name: "Five of Swords", upright: "Tranh cãi.", reversed: "Giảng hòa." },
    { name: "Six of Swords", upright: "Rời khỏi.", reversed: "Bị kéo lại." },
    { name: "Seven of Swords", upright: "Lừa dối.", reversed: "Thú nhận." },
    { name: "Eight of Swords", upright: "Mắc kẹt.", reversed: "Thoát ra." },
    { name: "Nine of Swords", upright: "Lo âu.", reversed: "Tự giải thoát." },
    { name: "Ten of Swords", upright: "Kết thúc.", reversed: "Hồi phục." },
    { name: "Page of Swords", upright: "Quan sát.", reversed: "Tin đồn." },
    { name: "Knight of Swords", upright: "Hành động mạnh.", reversed: "Nóng vội." },
    { name: "Queen of Swords", upright: "Logic.", reversed: "Lạnh lùng." },
    { name: "King of Swords", upright: "Minh triết.", reversed: "Cứng nhắc." },

    // PENTACLES
    { name: "Ace of Pentacles", upright: "Cơ hội.", reversed: "Thất thoát." },
    { name: "Two of Pentacles", upright: "Cân bằng.", reversed: "Rối loạn." },
    { name: "Three of Pentacles", upright: "Hợp tác.", reversed: "Thiếu phối hợp." },
    { name: "Four of Pentacles", upright: "Giữ chặt.", reversed: "Buông bỏ." },
    { name: "Five of Pentacles", upright: "Khó khăn.", reversed: "Hi vọng." },
    { name: "Six of Pentacles", upright: "Cho nhận.", reversed: "Bất công." },
    { name: "Seven of Pentacles", upright: "Chờ đợi.", reversed: "Nôn nóng." },
    { name: "Eight of Pentacles", upright: "Chăm chỉ.", reversed: "Thiếu tập trung." },
    { name: "Nine of Pentacles", upright: "Độc lập.", reversed: "Phụ thuộc." },
    { name: "Ten of Pentacles", upright: "Gia đình.", reversed: "Rạn nứt." },
    { name: "Page of Pentacles", upright: "Học hỏi.", reversed: "Thiếu cố gắng." },
    { name: "Knight of Pentacles", upright: "Bền bỉ.", reversed: "Chậm chạp." },
    { name: "Queen of Pentacles", upright: "Nâng đỡ.", reversed: "Kiểm soát." },
    { name: "King of Pentacles", upright: "Giàu có.", reversed: "Tham lam." }
];
