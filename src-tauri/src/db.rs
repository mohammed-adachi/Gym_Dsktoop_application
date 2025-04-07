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
    pub assirance: Option<f64>,
    pub sport_type: Option<String>,
    pub price: f64,
    pub phone: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub statut: Option<bool>, // Nouveau champ booléen optionnel
    pub garde_date: Option<String>,
}
#[derive(Debug, Serialize, Deserialize,Clone)]
pub struct UserHistory {
    pub id_user: String,
    pub start_date: String,
    pub end_date: String,
    pub price: f64,
    pub date_garde: Option<String>,
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
            registration_date TEXT,
            assirance REAL,
            sport_type TEXT NOT NULL,
            price REAL,
            start_date TEXT,
            end_date TEXT,
            statut INTEGER DEFAULT 1 , -- 1 = true par défaut
            garde_date TEXT
        )",
        [],
    )?;
    // Ajouter la colonne assirance si elle n'existe pas déjà
    conn.execute(
        "ALTER TABLE users ADD COLUMN assirance REAL",
        [],
    ).ok();

       conn.execute(
        "CREATE TABLE IF NOT EXISTS user_history (
            id_user TEXT,
            id_history INTEGER ,
            start_date TEXT,
            end_date TEXT,
            price REAL,
            date_garde TEXT,
            update_date TEXT DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id_user, id_history)
        )",
        [],
    )?;

    println!("Connection to SQLite database established!");
    Ok(())
}

use chrono::{NaiveDate, Duration};

// Fonction pour ajouter 30 jours à une date
fn add_30_days(date_str: &str) -> Option<String> {
    if let Ok(date) = NaiveDate::parse_from_str(date_str, "%Y-%m-%d") {
        let new_date = date + Duration::days(30);
        Some(new_date.format("%Y-%m-%d").to_string())
    } else {
        None
    }
}

// Insertion d'un utilisateur
pub fn add_user(conn: &Connection, user: &User) -> Result<()> {
    conn.execute(
        "INSERT INTO users (
            id, last_name, first_name, date_naissance, cin, profession, adresse, 
            photo, phone, registration_date, assirance, sport_type, price, start_date, end_date, statut,garde_date
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16,?17)",
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
            user.assirance,
            user.sport_type,
            user.price,
            user.start_date,
            user.end_date,
            1i32, // Valeur pour statut (1 = true par défaut)
            &user.start_date,
        ],
    )?;
     
    conn.execute(
        "INSERT INTO user_history (id_user, start_date, end_date, price, date_garde) 
        VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            &user.id,
            &user.start_date,
            &user.end_date,
            &user.price,
            &user.start_date // date_garde prend la valeur de start_date
        ],
    )?;
    Ok(())
}


// Récupération de tous les utilisateurs
pub fn get_users(conn: &Connection) -> Result<Vec<User>> {
    let mut stmt = conn.prepare(
        "SELECT id, last_name, first_name, date_naissance, cin, profession, adresse, 
        photo, phone, registration_date, sport_type, price, start_date, end_date,assirance,statut,garde_date FROM users",
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
                assirance: row.get(14)?,
                sport_type: row.get(10)?,
                price: row.get(11)?,
                start_date: row.get(12)?,
                end_date: row.get(13)?,
                statut: row.get(15)?,
                garde_date: row.get(16)?,

            })
        })?
        .collect::<Result<Vec<User>>>()?;

    Ok(users)
}
pub fn update_form_user(conn: &Connection, user: &User) -> Result<()> {
    conn.execute(
        "UPDATE users SET 
            id = ?1,
            last_name = ?2, 
            first_name = ?3,
            date_naissance = ?4,
            cin = ?5,
            profession = ?6, 
            adresse = ?7,
            photo = ?8, 
            phone = ?9,
            registration_date = ?10,
            assirance = ?11,
            sport_type = ?12,
            price = ?13,
            start_date = ?14,
            end_date = ?15,
            statut = ?16
            grade_date = ?17
        WHERE id = ?18",
        params![
            &user.id,
            user.last_name.as_ref(),
            user.first_name.as_ref(),
            user.date_naissance.as_ref(),
            user.cin.as_ref(),
            user.profession.as_ref(),
            user.adresse.as_ref(),
            user.photo.as_ref(),
            user.phone.as_ref(),
            user.registration_date.as_ref(),
            user.assirance.as_ref(),
            user.sport_type.as_ref(),
            &user.price,
            user.start_date.as_ref(),
            user.end_date.as_ref(),
            user.statut.map(|b| b as i32), // Convertit Option<bool> en Option<i32>
            &user.start_date, // date_garde prend la valeur de start_date
            &user.id // ID original pour la condition WHERE
        ],
    )?;
    Ok(())
}
#[derive(Debug, Serialize, Deserialize)]
pub struct UserUpdate {
    pub old_id: String,
    pub new_data: User,
}
pub fn update_all_user_fields(conn: &Connection, old_id: &str, new_user: &User) -> Result<()> {
    // D'abord, récupérer l'utilisateur actuel pour comparer les dates
    let current_user = get_userParId(conn, old_id)?;
    
    // Vérifier si les dates ont changé
    let dates_changed = current_user.start_date != new_user.start_date 
        || current_user.end_date != new_user.end_date;

    // Effectuer la mise à jour complète de l'utilisateur
    conn.execute(
        "UPDATE users SET 
            id = ?1,
            photo = ?2,
            last_name = ?3, 
            first_name = ?4,
            date_naissance = ?5,
            cin = ?6,
            profession = ?7, 
            adresse = ?8,
            phone = ?9,
            registration_date = ?10,
            assirance = ?11,
            sport_type = ?12,
            price = ?13,
            start_date = ?14,
            end_date = ?15,
            statut = ?16,
            garde_date = ?17
        WHERE id = ?18",
        params![
            &new_user.id,
            new_user.photo.as_ref(),
            new_user.last_name.as_ref(),
            new_user.first_name.as_ref(),
            new_user.date_naissance.as_ref(),
            new_user.cin.as_ref(),
            new_user.profession.as_ref(),
            new_user.adresse.as_ref(),
            new_user.phone.as_ref(),
            new_user.registration_date.as_ref(),
            new_user.assirance,
            new_user.sport_type.as_ref(),
            new_user.price,
            new_user.start_date.as_ref(),
            new_user.end_date.as_ref(),
            new_user.statut.map(|b| b as i32),
            new_user.start_date.as_ref(),
            old_id
        ],
    )?;
    
    // Mettre à jour les références dans user_history si l'ID a changé
    if old_id != new_user.id {
        conn.execute(
            "UPDATE user_history SET id_user = ?1 WHERE id_user = ?2",
            params![&new_user.id, old_id],
        )?;
    }
    
    // Ajouter une entrée dans l'historique seulement si les dates ont changé
    if dates_changed {
        conn.execute(
            "INSERT INTO user_history (id_user, start_date, end_date, price, date_garde) 
            VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                &new_user.id,
                &new_user.start_date,
                &new_user.end_date,
                &new_user.price,
                &new_user.start_date // date_garde prend la valeur de start_date
            ],
        )?;
    }
    
    Ok(())
}
// Mise à jour d'un utilisateur
pub fn update_user(conn: &Connection, user: &User) -> Result<()> {
     

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
            cin = COALESCE(?13, cin),
            garde_date = COALESCE(?14, garde_date)
        WHERE id = ?15",
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
            user.garde_date.as_ref(),
            &user.id,
        ),
    )?;
    conn.execute(
        "INSERT INTO user_history (id_user, start_date, end_date, price) 
        VALUES (?1, ?2, ?3, ?4)",
        params![
            &user.id,
            &user.start_date,
            &user.end_date,
            &user.price,
        ],
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
        photo, phone, registration_date, sport_type, price, start_date, end_date,assirance,statut,garde_date FROM users WHERE id = ?1",
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
                assirance: row.get(14)?,
                sport_type: row.get(10)?,
                price: row.get(11)?,
                start_date: row.get(12)?,
                end_date: row.get(13)?,
                statut: row.get(15)?,
                garde_date: row.get(16)?,
            })
        })?
        .collect::<Result<Vec<User>>>()?;
    Ok(user[0].clone())
}
pub fn user_histId(conn: &Connection, id: &str) -> Result<Vec<UserHistory>> {
    let mut stmt = conn.prepare(
        "SELECT id_user, start_date, end_date, price,date_garde FROM user_history WHERE id_user = ?1",
    )?;

    let user_histories = stmt
        .query_map(params![id], |row| {
            Ok(UserHistory {
                id_user: row.get(0)?,
                start_date: row.get(1)?,
                end_date: row.get(2)?,
                price: row.get(3)?,
                date_garde: row.get(4)?,

            })
        })?
        .collect::<Result<Vec<UserHistory>>>()?;

    Ok(user_histories)
}

pub fn delete_payment(conn: &Connection, id_user: &str, start_date: &str) -> Result<()> {
    conn.execute(
        "DELETE FROM user_history WHERE id_user = ?1 AND start_date = ?2", 
        params![id_user, start_date],
    )?;
    Ok(())
}