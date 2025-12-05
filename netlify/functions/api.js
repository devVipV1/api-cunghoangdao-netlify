// netlify/functions/api.js
exports.handler = async (event, context) => {
    const url = new URL(event.rawUrl);
    const path = url.pathname.toLowerCase();
    const params = url.searchParams;

    // ====== HOME ======
    if (path === "/home" || path === "/") {
        return responseJSON({
            message: "Hướng dẫn sử dụng API",
            endpoints: {
                "/cunghoangdao?date=16/02": "Xem cung hoàng đạo",
                "/duyen?name1=Nam&dob1=16/02/2009&name2=Nu&dob2=29/06/2009": "Xem độ hợp duyên",
                "/tarot?name=Nam&dob=16/02/2009": "Rút bài tarot tình duyên"
            }
        });
    }

    // ====== CUNG HOÀNG ĐẠO ======
    if (path === "/cunghoangdao") {
        const date = params.get("date");
        if (!date) return responseJSON({ error: "Thiếu tham số ?date=" });

        const sign = zodiac(date);
        return responseJSON({ date, zodiac: sign });
    }

    // ====== DUYÊN ======
    if (path === "/duyen") {
        const name1 = params.get("name1");
        const dob1 = params.get("dob1");
        const name2 = params.get("name2");
        const dob2 = params.get("dob2");

        if (!name1 || !dob1 || !name2 || !dob2)
            return responseJSON({ error: "Thiếu tham số (name1, dob1, name2, dob2)" });

        const percent = Math.floor(Math.random() * 41) + 60; // 60–100%
        return responseJSON({
            message: "Xem độ hợp duyên",
            couple: `${name1} ❤ ${name2}`,
            percent: percent + "%",
            note: "Kết quả chỉ mang tính chất vui."
        });
    }

    // ====== TAROT ======
    if (path === "/tarot") {
        const name = params.get("name");
        const dob = params.get("dob");

        if (!name || !dob)
            return responseJSON({ error: "Thiếu tham số (name, dob)" });

        const tarotCards = [
            "The Lovers – Tình duyên mở lối, có người thương thầm.",
            "The Sun – Niềm vui, hạnh phúc tới gần.",
            "The Moon – Có điều khiến bạn lo lắng, cần bình tĩnh.",
            "The Star – Hi vọng mới, tình cảm hanh thông.",
            "Wheel of Fortune – Biến chuyển lớn trong chuyện tình."
        ];

        const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];

        return responseJSON({
            name,
            dob,
            tarot: card
        });
    }

    // ====== NOT FOUND ======
    return responseJSON({ error: "Endpoint không tồn tại" }, 404);
};

// =======================
// HÀM XỬ LÝ JSON TRẢ VỀ
// =======================
function responseJSON(data, status = 200) {
    return {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2)
    };
}

// =======================
// HÀM TÍNH CUNG HOÀNG ĐẠO
// =======================
function zodiac(dateStr) {
    // input: "16/02"
    const [day, month] = dateStr.split("/").map(Number);

    const zodiacList = [
        ["Ma Kết", 1, 19], ["Bảo Bình", 2, 18],
        ["Song Ngư", 3, 20], ["Bạch Dương", 4, 19],
        ["Kim Ngưu", 5, 20], ["Song Tử", 6, 21],
        ["Cự Giải", 7, 22], ["Sư Tử", 8, 22],
        ["Xử Nữ", 9, 22], ["Thiên Bình", 10, 23],
        ["Bọ Cạp", 11, 22], ["Nhân Mã", 12, 21],
        ["Ma Kết", 12, 31]
    ];

    for (let i = 0; i < zodiacList.length; i++) {
        const [sign, m, d] = zodiacList[i];

        if (month === m && day <= d) return sign;
    }
    return "Không xác định";
}
