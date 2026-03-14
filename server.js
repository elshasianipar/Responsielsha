const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let data = [];
let counter = 1; 

app.get("/api/data", (req, res) => {
    res.json(data);
});

app.post("/api/data", (req, res) => {
    const item = req.body;
    
    // Jika data kosong, reset counter ke 1
    if (data.length === 0) counter = 1;

    item.id = Date.now();
    // Otomatis buat NPM jika tidak diisi manual
    if (!item.npm) {
        item.npm = `G1A024${counter.toString().padStart(3, '0')}`;
        counter++;
    }
    
    data.push(item);
    res.json(item);
});

// Update: Sekarang bisa update NPM juga
app.put("/api/data/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = data.findIndex(d => d.id === id);
    if (index !== -1) {
        data[index].nama = req.body.nama;
        data[index].email = req.body.email;
        data[index].npm = req.body.npm; // Baris ini mengizinkan edit NPM
        res.json(data[index]);
    } else {
        res.status(404).json({message: "Data tidak ditemukan"});
    }
});

app.delete("/api/data/:id", (req, res) => {
    const id = parseInt(req.params.id);
    data = data.filter(d => d.id !== id);
    
    // Jika setelah dihapus data jadi kosong, reset counter
    if (data.length === 0) counter = 1;
    
    res.json({message: "deleted"});
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});