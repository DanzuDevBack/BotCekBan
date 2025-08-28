export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({
      error: "⚠️ Masukkan nomor. Contoh: /api/cekban?number=+62%2081378644092"
    });
  }

  // Normalisasi nomor
  const clean = number.replace(/[+\-\s]/g, "");
  const country = clean.substring(0, 2);
  const phone = clean.substring(2);

  const url = `https://api.fg-project.xyz/api/tools/cekwa?country=${country}&number=${phone}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    return res.status(200).json({
      success: true,
      input: number,
      normalized: { country, phone },
      result
    });
  } catch (err) {
    return res.status(500).json({ error: "❌ " + err.message });
  }
}
