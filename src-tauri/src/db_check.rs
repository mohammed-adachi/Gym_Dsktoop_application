use rusqlite::{Connection, Result};

fn check_db_connection() -> Result<bool> {
    let conn = Connection::open("gym_management.db")?;
    
    // Exécuter une requête simple pour vérifier la connexion
    let result: Result<i32> = conn.query_row("SELECT 1", [], |row| row.get(0));
    
    match result {
        Ok(_) => {
            println!("Connexion à gym_management.db établie avec succès!");
            Ok(true)
        },
        Err(e) => {
            println!("Erreur lors de la vérification de la connexion: {}", e);
            Ok(false)
        }
    }
}

fn main() -> Result<()> {
    match check_db_connection() {
        Ok(true) => println!("La base de données est accessible."),
        Ok(false) => println!("Impossible d'accéder à la base de données."),
        Err(e) => println!("Une erreur s'est produite: {}", e),
    }
    Ok(())
}

// Exécution de la fonction principale
main().unwrap();