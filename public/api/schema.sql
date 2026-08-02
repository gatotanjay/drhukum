-- ============================================================
-- Skema database untuk sistem Insight (Blog + Legal Updates)
-- Import file ini lewat phpMyAdmin di hPanel Hostinger
-- ============================================================

-- Tabel akun admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel utama post (blog & legal update pakai tabel yang sama, dibedakan lewat kolom "type")
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('blog', 'legal_update') NOT NULL,
  category VARCHAR(100) NOT NULL,       -- kategori (blog) atau tag (legal update)
  thumbnail VARCHAR(500) DEFAULT NULL,  -- path/URL gambar thumbnail
  post_date DATE NOT NULL,
  read_time VARCHAR(50) DEFAULT NULL,   -- khusus blog, contoh: "8 menit baca"
  author VARCHAR(100) DEFAULT NULL,     -- khusus blog
  featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type_status (type, status),
  INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel terjemahan per bahasa untuk tiap post (1 post = 3 baris: id, en, zh)
CREATE TABLE IF NOT EXISTS post_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  locale ENUM('id', 'en', 'zh') NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT DEFAULT NULL,        -- isi lengkap artikel (HTML dari rich text editor)
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_locale (post_id, locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
