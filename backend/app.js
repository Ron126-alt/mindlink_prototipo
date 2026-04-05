const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lasa.20RonaldG",
  database: "salud_mental_db"
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conectado a MySQL correctamente");
  }
});


app.post("/register", async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO usuario (first_name, last_name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al registrar usuario" });
      }

      res.json({
        message: "Usuario registrado correctamente",
        id: result.insertId
      });

    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }

});


app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM usuario WHERE email = ?";

  db.query(sql, [email], async (err, results) => {

    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login correcto",
      user: {
        id: user.id,
        nombre: user.first_name,
        email: user.email
      }
    });

  });

});

app.post("/emocion", (req, res) => {

  const { fecha, estado, nota, usuario_id } = req.body;

  if (!fecha || !estado || !usuario_id) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = "INSERT INTO emocion (fecha, estado, nota, usuario_id) VALUES (?, ?, ?, ?)";

  db.query(sql, [fecha, estado, nota, usuario_id], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar emoción" });
    }

    res.json({
      message: "Emoción guardada correctamente",
      id: result.insertId
    });

  });

});

app.get("/emocion", (req, res) => {

  const sql = "SELECT * FROM emocion ORDER BY fecha DESC";

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json({ error: "Error al obtener emociones" });
    }

    res.json(results);

  });

});

app.delete("/emocion/:id", (req, res) => {

  const { id } = req.params;

  const sql = "DELETE FROM emocion WHERE id = ?";

  db.query(sql, [id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al eliminar" });
    }

    res.json({ message: "Eliminado correctamente" });

  });

});

app.put("/emocion/:id", (req, res) => {

  const { id } = req.params;
  const { estado, nota } = req.body;

  const sql = "UPDATE emocion SET estado = ?, nota = ? WHERE id = ?";

  db.query(sql, [estado, nota, id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al actualizar" });
    }

    res.json({ message: "Actualizado correctamente" });

  });

});


app.post("/admin", async (req, res) => {

  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const hash = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO administrador (nombre, email, password) VALUES (?, ?, ?)";

  db.query(sql, [nombre, email, hash], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al crear admin" });
    }
    res.json({ message: "Administrador creado" });
  });

});

app.get("/admin", (req, res) => {

  db.query("SELECT * FROM administrador", (err, results) => {
    if (err) return res.status(500).json({ error: "Error" });
    res.json(results);
  });

});

app.delete("/admin/:id", (req, res) => {

  db.query("DELETE FROM administrador WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Error" });
    res.json({ message: "Eliminado" });
  });

});

app.put("/admin/:id", async (req, res) => {

  const { nombre, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "UPDATE administrador SET nombre=?, email=?, password=? WHERE id=?",
    [nombre, email, hash, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error" });
      res.json({ message: "Actualizado" });
    }
  );

});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});