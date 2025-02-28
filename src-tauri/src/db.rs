use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize,Clone)]
pub struct User {
    pub id: String,
    pub photo: Option<String>,
    pub last_name: Option<String>,
    pub first_name: Option<String>,
    pub date_naissance: Option<String>,
    pub cin: Option<String>,
    pub profession: Option<String>,
    pub adresse: Option<String>,
    pub registration_date: Option<String>,
    pub sport_type: Option<String>,
    pub price: f64,
    pub phone: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}
#[derive(Debug, Serialize, Deserialize,Clone)]
pub struct UserHistory {
    pub id_user: String,
    pub start_date: String,
    pub end_date: String,
    pub price: f64,
}

// Initialisation de la base de données
pub fn init_db(conn: &Connection) -> Result<()> {
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
       conn.execute(
        "CREATE TABLE IF NOT EXISTS user_history (
            id_user TEXT,
            id_history INTEGER ,
            start_date TEXT,
            end_date TEXT,
            price REAL,
            update_date TEXT DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id_user, id_history)
        )",
        [],
    )?;

    println!("Connection to SQLite database established!");
    Ok(())
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
pub fn update_form_user(conn: &Connection, user: &User) -> Result<()> {
    conn.execute(
        "UPDATE users SET 
            last_name = COALESCE(?1, last_name), 
            first_name = COALESCE(?2, first_name),
            date_naissance = COALESCE(?3, date_naissance),
            cin = COALESCE(?4, cin),
            profession = COALESCE(?5, profession), 
            adresse = COALESCE(?6, adresse),
            photo = COALESCE(?7, photo), 
            phone = COALESCE(?8, phone),
            registration_date = COALESCE(?9, registration_date),
            sport_type = COALESCE(?10, sport_type),
            price = COALESCE(?11, price),
            start_date = COALESCE(?12, start_date),
            end_date = COALESCE(?13, end_date)
        WHERE id = ?14",
        (
            user.last_name.as_ref(),
            user.first_name.as_ref(),
            user.date_naissance.as_ref(),
            user.cin.as_ref(),
            user.profession.as_ref(),
            user.adresse.as_ref(),
            user.photo.as_ref(),
            user.phone.as_ref(),
            user.registration_date.as_ref(),
            user.sport_type.as_ref(),
            &user.price,
            user.start_date.as_ref(),
            user.end_date.as_ref(),
            &user.id,
        ),
    )?;
    Ok(())
}

// Mise à jour d'un utilisateur
pub fn update_user(conn: &Connection, user: &User) -> Result<()> {
     conn.execute(
        "INSERT INTO user_history (id_user, start_date, end_date, price) 
        VALUES (?1, ?2, ?3, ?4)",
        params![
            &user.id,
            &user.start_date,
            &user.end_date,
            &user.price
        ],
    )?;

    conn.execute(
        "UPDATE users SET 
            start_date = ?1, 
            end_date = ?2, 
            price = ?3,
            photo = COALESCE(?4, photo), 
            last_name = COALESCE(?5, last_name), 
            first_name = COALESCE(?6, first_name),
            profession = COALESCE(?7, profession), 
            adresse = COALESCE(?8, adresse),
            sport_type = COALESCE(?9, sport_type),
            phone = COALESCE(?10, phone),
            registration_date = COALESCE(?11, registration_date),
            date_naissance = COALESCE(?12, date_naissance),
            cin = COALESCE(?13, cin)
        WHERE id = ?14",
        (
            &user.start_date,
            &user.end_date,
            &user.price,
            user.photo.as_ref(),
            user.last_name.as_ref(),
            user.first_name.as_ref(),
            user.profession.as_ref(),
            user.adresse.as_ref(),
            user.sport_type.as_ref(),
            user.phone.as_ref(),
            user.registration_date.as_ref(),
            user.date_naissance.as_ref(),
            user.cin.as_ref(),
            &user.id,
        ),
    )?;
    Ok(())
}

// Suppression d'un utilisateur
pub fn delete_user(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM users WHERE id = ?1", params![id])?;
    Ok(())
}
pub fn get_userParId(conn: &Connection, id: &str) -> Result<User> {
    let mut stmt = conn.prepare(
        "SELECT id, last_name, first_name, date_naissance, cin, profession, adresse, 
        photo, phone, registration_date, sport_type, price, start_date, end_date FROM users WHERE id = ?1",
    )?;

    let user = stmt
        .query_map(params![id], |row| {
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
    Ok(user[0].clone())
}
pub fn user_histId(conn: &Connection, id: &str) -> Result<Vec<UserHistory>> {
    let mut stmt = conn.prepare(
        "SELECT id_user, start_date, end_date, price FROM user_history WHERE id_user = ?1",
    )?;

    let user_histories = stmt
        .query_map(params![id], |row| {
            Ok(UserHistory {
                id_user: row.get(0)?,
                start_date: row.get(1)?,
                end_date: row.get(2)?,
                price: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<UserHistory>>>()?;

    Ok(user_histories)
}
