use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

// Définition de la structure User
#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub date_naissance: String,
    pub cin: String,
    pub profession: String,
    pub adresse: String,
    pub photo: String,
    pub phone: String,
     pub date_inscrit: String,
}

// Définition de la structure Abonement
#[derive(Debug, Serialize, Deserialize)]
pub struct Abonement {
    pub id: String,
    pub id_user: String,
    pub date_debut: String,
    pub date_fin: String,
    pub type_abonement: bool,
    pub montant: String,
   
}

// Fonction pour initialiser la base de données SQLite
pub fn init_db() -> Result<Connection> {
    let conn = Connection::open("gym_managemne.db")?; // Création de la base de données (fichier gym.db)
    
    // Création de la table `users` si elle n'existe pas
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date_naissance TEXT NOT NULL,
            cin TEXT,
            profession TEXT,
            phone TEXT,
            adresse TEXT,
            photo TEXT
        )",
        [],
    )?;
    
    // Création de la table `abonement` si elle n'existe pas
    conn.execute(
        "CREATE TABLE IF NOT EXISTS abonement (
            id TEXT PRIMARY KEY,
            id_user TEXT NOT NULL,
            date_debut TEXT NOT NULL,
            date_fin TEXT NOT NULL,
            type_abonement BOOLEAN,
            montant REAL,
            date_inscrit TEXT NOT NULL,
            FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
        )",
        [],
    )?;
    
    println!("Connection to SQLite database established!");
    Ok(conn)
}

// Fonction pour ajouter un utilisateur
pub fn add_user(conn: &mut Connection, user: &User) -> Result<u64> {
    conn.execute(
        "INSERT INTO users (id, name, date_naissance, cin, profession, adresse, photo, phone) 
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            &user.id,
            &user.name,
            &user.date_naissance,
            &user.cin,
            &user.profession,
            &user.adresse,
            &user.photo,
            &user.phone,
        ],
    )?;
    Ok(1)  // SQLite ne supporte pas directement `last_insert_id`, mais on peut retourner un ID fictif.
}

// Fonction pour récupérer tous les utilisateurs
pub fn get_users(conn: &mut Connection) -> Result<Vec<User>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, date_naissance, cin, profession, adresse, photo, phone FROM users",
    )?;

    let users = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
                date_naissance: row.get(2)?,
                cin: row.get(3)?,
                profession: row.get(4)?,
                adresse: row.get(5)?,
                photo: row.get(6)?,
                phone: row.get(7)?,
                date_inscrit: row.get(8)?,
            })
        })?
        .collect::<Result<Vec<User>>>()?;

    Ok(users)
}

// Fonction pour mettre à jour un utilisateur
pub fn update_user(conn: &mut Connection, user: &User) -> Result<()> {
    conn.execute(
        "UPDATE users SET name = ?1, phone = ?2 WHERE id = ?3",
        params![&user.name, &user.phone, &user.id],
    )?;
    Ok(())
}

// Fonction pour supprimer un utilisateur
pub fn delete_user(conn: &mut Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM users WHERE id = ?1", params![id])?;
    Ok(())
}
