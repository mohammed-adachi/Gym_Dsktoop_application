use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub photo: String,
    pub last_name: String,
    pub first_name: String,
    pub date_naissance: String, // Utilisez `String` ou `chrono::NaiveDate`
    pub cin: String,
    pub profession: String,
    pub adresse: String,
    pub registration_date: String, // Utilisez `String` ou `chrono::NaiveDate`
    pub sport_type: String,
    pub price: f64, // Utilisez `f64` pour les nombres flottants
    pub phone: String,
    pub start_date: String, // Utilisez `String` ou `chrono::NaiveDate`
    pub end_date: String,   // Utilisez `String` ou `chrono::NaiveDate`
}
pub fn check_db_connection() -> Result<bool, rusqlite::Error> {
    let conn = Connection::open("gym_management.db")?;
    
    // Exécuter une requête simple pour vérifier la connexion
    let result: Result<i32, rusqlite::Error> = conn.query_row("SELECT 1", [], |row| row.get(0));
    
    match result {
        Ok(_) => {
            println!("Connexion à gym_management.db établie avec succès!");
            Ok(true)
        },
        Err(e) => {
            eprintln!("Erreur lors de la vérification de la connexion: {}", e);
            Ok(false)
        }
    }
}
// Initialisation de la base de données
pub fn init_db() -> Result<Connection> {
    let conn = Connection::open("gym_management.db")?;
    conn.execute("DROP TABLE IF EXISTS abonement", [])?;
    conn.execute("DROP TABLE IF EXISTS users", [])?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            last_name TEXT NOT NULL,
            first_name TEXT NOT NULL,
            date_naissance TEXT,
            cin TEXT,
            profession TEXT,
            adresse TEXT,
            photo TEXT,
            phone TEXT,
            registration_date TEXT NOT NULL,
            sport_type TEXT NOT NULL,
            price REAL,
            start_date TEXT,
            end_date TEXT
        )",
        [],
    )?;
    println!("Connection to SQLite database established!");
    Ok(conn)
}

// Insertion d'un utilisateur
pub fn add_user(conn: &Connection, user: &User) -> Result<()> {
    
    conn.execute(
        "INSERT INTO users (
            id, last_name, first_name, date_naissance, cin, profession, adresse, 
            photo, phone, registration_date, sport_type, price, start_date, end_date
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
        params![
            user.id,
            user.last_name,
            user.first_name,
            user.date_naissance,
            user.cin,
            user.profession,
            user.adresse,
            user.photo,
            user.phone,
            user.registration_date,
            user.sport_type,
            user.price,
            user.start_date,
            user.end_date,
        ],
    )?;
    Ok(())
}

// Récupération de tous les utilisateurs
pub fn get_users(conn: &Connection) -> Result<Vec<User>> {
    let mut stmt = conn.prepare(
        "SELECT id, last_name, first_name, date_naissance, cin, profession, adresse, 
        photo, phone, registration_date, sport_type, price, start_date, end_date FROM users",
    )?;

    let users = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                last_name: row.get(1)?,
                first_name: row.get(2)?,
                date_naissance: row.get(3)?,
                cin: row.get(4)?,
                profession: row.get(5)?,
                adresse: row.get(6)?,
                photo: row.get(7)?,
                phone: row.get(8)?,
                registration_date: row.get(9)?,
                sport_type: row.get(10)?,
                price: row.get(11)?,
                start_date: row.get(12)?,
                end_date: row.get(13)?,
            })
        })?
        .collect::<Result<Vec<User>>>()?;

    Ok(users)
}


// Fonction pour mettre à jour un utilisateur
pub fn update_user(conn: &mut Connection, user: &User) -> Result<()> {
    conn.execute(
        "UPDATE users SET name = ?1, phone = ?2 WHERE id = ?3",
        params![&user.first_name, &user.phone, &user.id],
    )?;
    Ok(())
}

// Fonction pour supprimer un utilisateur
pub fn delete_user(conn: &mut Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM users WHERE id = ?1", params![id])?;
    Ok(())
}
