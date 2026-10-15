-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2026 at 05:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drhukum`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2y$10$KK5tFYkC0eg1ZLyxkuOcoOUzmeGsWHn3J1yhNsy56xIhpvdELmRE.', '2026-08-02 09:07:42'),
(2, 'admin2', '$2y$10$ph0hF/xLkQLGVH1YgNrosO66fwLc8vTZmTr81TZPRvm/0qFXNOozO', '2026-08-02 10:10:46');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `type` enum('blog','legal_update','tutorial','sop','client_update') NOT NULL,
  `category` varchar(100) NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `post_date` date NOT NULL,
  `read_time` varchar(50) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `type`, `category`, `thumbnail`, `video_url`, `post_date`, `read_time`, `author`, `featured`, `status`, `created_at`, `updated_at`) VALUES
(1, 'blog', 'Visa & Immigration', '/uploads/thumbnails/thumb_6a73271810de60.60612444.webp', NULL, '2026-08-02', '6 menit baca', 'Tim DrHukum', 1, 'published', '2026-08-02 09:18:09', '2026-08-05 12:05:45'),
(10, 'tutorial', 'tutorial', '/uploads/thumbnails/thumb_6ab12f8527add1.06890458.webp', 'https://www.youtube.com/watch?v=YwNs1Z0qRY0', '2026-09-14', '12', 'drhukum', 0, 'published', '2026-09-14 07:34:53', '2026-09-21 13:22:15'),
(12, 'sop', 'Atot', NULL, NULL, '2026-09-14', NULL, NULL, 0, 'published', '2026-09-14 07:39:43', '2026-09-14 07:39:43');

-- --------------------------------------------------------

--
-- Table structure for table `post_translations`
--

CREATE TABLE `post_translations` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `locale` enum('id','en','zh') NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_translations`
--

INSERT INTO `post_translations` (`id`, `post_id`, `locale`, `title`, `excerpt`, `content`) VALUES
(1, 1, 'id', '(Example) Panduan Lengkap KITAS untuk Tenaga Kerja Asing di Indonesia 2026', 'Memahami jenis-jenis KITAS, syarat pengajuan, dan proses yang perlu dilalui tenaga kerja asing yang ingin bekerja secara legal di Indonesia.', '<p>Kartu Izin Tinggal Terbatas (KITAS) adalah dokumen wajib bagi warga negara asing yang ingin tinggal dan bekerja di Indonesia dalam jangka waktu tertentu. Tanpa KITAS yang sesuai, aktivitas kerja WNA berisiko dianggap ilegal.</p><p><br></p><p>Jenis-Jenis KITAS</p><p><br></p><p>Ada beberapa kategori KITAS yang umum diajukan, di antaranya KITAS kerja (untuk karyawan perusahaan), KITAS investor (untuk pemilik saham perusahaan PMA), dan KITAS keluarga (untuk pasangan atau anak dari pemegang KITAS/WNI).</p><p><br></p><p>Dokumen yang Umumnya Diperlukan</p><p><br></p><p>Secara umum, pengajuan KITAS memerlukan sponsor dari perusahaan atau individu di Indonesia, paspor yang masih berlaku, serta kelengkapan administrasi lain sesuai kategori yang diajukan.</p><p><br></p><p>Mengapa Perlu Bantuan Konsultan Hukum</p><p><br></p><p>Proses pengajuan KITAS melibatkan banyak instansi dan persyaratan yang dapat berubah sewaktu-waktu. Pendampingan dari konsultan hukum membantu memastikan proses berjalan lancar dan sesuai regulasi yang berlaku.</p><p><br></p><p>Ingin berkonsultasi mengenai pengajuan KITAS untuk kebutuhan Anda atau perusahaan? Tim DrHukum siap membantu.</p>'),
(2, 1, 'en', '(Example) Complete Guide to KITAS for Foreign Workers in Indonesia 2026', 'Understanding the types of KITAS, application requirements, and the process foreign workers need to go through to work legally in Indonesia.', '<p>A Limited Stay Permit Card (KITAS) is a mandatory document for foreign nationals who wish to live and work in Indonesia for a certain period. Without the appropriate KITAS, a foreign worker\'s activities may be considered illegal.</p><p><br></p><p>Types of KITAS</p><p><br></p><p>There are several common categories of KITAS, including work KITAS (for company employees), investor KITAS (for shareholders of PMA companies), and family KITAS (for spouses or children of KITAS/Indonesian citizen holders).</p><p><br></p><p>Commonly Required Documents</p><p><br></p><p>Generally, a KITAS application requires sponsorship from a company or individual in Indonesia, a valid passport, and other administrative documents depending on the category applied for.</p><p><br></p><p>Why You Need Legal Consultant Assistance</p><p><br></p><p>The KITAS application process involves multiple agencies and requirements that can change from time to time. Support from a legal consultant helps ensure the process runs smoothly and complies with applicable regulations.</p><p><br></p><p>Want to consult about applying for a KITAS for your personal or company needs? The DrHukum team is ready to help.</p>'),
(3, 1, 'zh', '(Example) 2026年外籍劳工KITAS完整指南', '了解KITAS的种类、申请要求，以及外籍劳工在印度尼西亚合法工作所需经历的流程。', '<p>临时居留许可卡（KITAS）是希望在印度尼西亚居住和工作一定期限的外国公民的必备文件。如果没有合适的KITAS，外籍劳工的工作活动可能被视为非法。</p><p><br></p><p>KITAS的种类</p><p><br></p><p>常见的KITAS类别包括工作KITAS（适用于公司员工）、投资者KITAS（适用于PMA公司股东）以及家庭KITAS（适用于KITAS持有者或印尼公民的配偶或子女）。</p><p><br></p><p>通常需要的文件</p><p><br></p><p>一般而言，申请KITAS需要印尼公司或个人的担保、有效护照，以及根据申请类别所需的其他行政文件。</p><p><br></p><p>为什么需要法律顾问的帮助</p><p><br></p><p>KITAS申请流程涉及多个机构，且要求可能随时变化。法律顾问的协助有助于确保流程顺利进行并符合现行法规。</p><p><br></p><p>想咨询为您个人或公司申请KITAS的相关事宜吗？DrHukum团队随时为您提供帮助。</p>'),
(55, 10, 'id', 'Tutor nih', 'tutor', '<p>1</p>'),
(56, 10, 'en', '1', '1', '<p>1</p>'),
(57, 10, 'zh', '1', '1', '<p>1</p>'),
(70, 12, 'id', '1', '1', '<p>1</p>'),
(71, 12, 'en', '1', '1', '<p>1</p>'),
(72, 12, 'zh', '1', '1', '<p>1</p>');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_status` (`type`,`status`),
  ADD KEY `idx_featured` (`featured`);

--
-- Indexes for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_locale` (`post_id`,`locale`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `post_translations`
--
ALTER TABLE `post_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD CONSTRAINT `post_translations_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
