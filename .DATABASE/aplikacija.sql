/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aplikacija`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uk_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'skaya', '6751B6D8FD57834E0A3DE5FE0C8D4418425380C9D2BD2315D1BDDE24696F25351D8B30F561DB475A440B995B42BE00B0D0986DDF04B099618003499B3944D864'),
	(2, 'ivanzg', '199619961996199'),
	(3, 'milosze', '123456789000000'),
	(5, 'necanbgd', '733F1E2DF22BF9F9001A74E89C14952D295107374EA0990B71346DF109972C307982CB12D2F46345F05DE2771C921A9361D5322D998FCF67A86A1EDB5BF3881C'),
	(6, 'marenbg', '8F08CFCF0E6002D9A20E0C32061E6ABBBA99B8DDA76F92073D1C04896CD828C5F53FEC53D887E652AEF3B27F0CEF554051841EE77C84292D3C7E34E39D5AA6B2'),
	(8, 'gaga', 'FC31DD5E3748433156E64F7DB87751AFAA9D84D605B45AC41232FEA25D2FBCD8B2D119CB6CAF09A65E4BD2B6EF68B211F8DEF4FD8E847C7B262B18FF2153AD0B'),
	(9, 'andromache', 'F85EE88F9B286196D84AEE5197D4BBF201EBF31A6D6AC5F6F178F3F0226670BC0BCCE4E8E6764168247D2E3FD1F9B1A717A8501A7A79E5FE9241E34D1B86474F'),
	(10, 'shufuni', '43F96932F21E258419F24E3F7C185565850ED0EA4D0E79CEA2C74794CFA6AA1F44DE93736F90A291DE5386C0D731F427F013C1C1806107B1014588C94B092CB3');

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `except` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('available','visible','hidden') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `is_promoted` tinyint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article`;
INSERT INTO `article` (`article_id`, `name`, `category_id`, `except`, `description`, `status`, `is_promoted`, `created_at`) VALUES
	(1, 'ACME HDD 512GB', 5, 'Kratak opis...', 'Detaljan opis...', 'available', 0, '2024-05-22 14:02:34'),
	(4, 'ACME HD11 2TB', 5, 'Neki kratak tekst 2...', 'Neki malo duzi tekst o proizvodu 2.', 'visible', 1, '2024-05-24 12:13:42');

DROP TABLE IF EXISTS `article_feature`;
CREATE TABLE IF NOT EXISTS `article_feature` (
  `article_feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `feature_id` int unsigned NOT NULL DEFAULT '0',
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`article_feature_id`),
  UNIQUE KEY `uq_article_feature_article_id_feature_id` (`article_id`,`feature_id`),
  KEY `fk_article_feature_feature_id` (`feature_id`),
  CONSTRAINT `fk_article_feature_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_article_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article_feature`;
INSERT INTO `article_feature` (`article_feature_id`, `article_id`, `feature_id`, `value`) VALUES
	(1, 1, 1, '512GB'),
	(2, 1, 4, 'SATA3'),
	(3, 1, 5, 'SSD'),
	(22, 4, 1, '3TB');

DROP TABLE IF EXISTS `article_price`;
CREATE TABLE IF NOT EXISTS `article_price` (
  `article_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT (0),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`article_price_id`),
  KEY `fk_article_price_article_id` (`article_id`),
  CONSTRAINT `fk_article_price_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article_price`;
INSERT INTO `article_price` (`article_price_id`, `article_id`, `price`, `created_at`) VALUES
	(1, 1, 45.00, '2024-05-22 17:10:32'),
	(2, 1, 43.56, '2024-05-22 17:10:56'),
	(5, 4, 56.89, '2024-05-24 12:13:42'),
	(6, 4, 57.11, '2024-06-07 14:04:11');

DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `card_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`card_id`),
  KEY `fk_card_user_id` (`user_id`),
  CONSTRAINT `fk_card_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `card`;

DROP TABLE IF EXISTS `card_article`;
CREATE TABLE IF NOT EXISTS `card_article` (
  `card_article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `card_id` int unsigned NOT NULL DEFAULT '0',
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `quantity` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`card_article_id`),
  UNIQUE KEY `uk_card_article_id_card_id_article_id` (`card_id`,`article_id`),
  KEY `card_article_id_article_id` (`article_id`),
  CONSTRAINT `card_article_id_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `card_article_id_card_id` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `card_article`;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `parent__category_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uk_category_name` (`name`),
  UNIQUE KEY `uk_category_image_path` (`image_path`),
  KEY `fk_category_parent_category_id` (`parent__category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent__category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent__category_id`) VALUES
	(1, 'Računarske komponente', 'assets/pc.jpg', NULL),
	(2, 'Kućna elektronika', 'assets/home.jpg', NULL),
	(3, 'Laptop računari', 'assets/pc/laptop.jpg', 1),
	(4, 'Memorijski mediji', 'assets/pc/memory.jpg', 1),
	(5, 'Hard diskovi', 'assets/pc/memory/hdd.jpg', 4);

DROP TABLE IF EXISTS `feature`;
CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT (0),
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uk_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_category_id` (`category_id`),
  CONSTRAINT `fk_feature_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `feature`;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(1, 'Kapacitet', 5),
	(6, 'Napon', 2),
	(8, 'Proizvođač', 2),
	(7, 'Snaga', 2),
	(5, 'Tehnologija', 5),
	(4, 'Tip', 5);

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `card_id` int unsigned NOT NULL DEFAULT (0),
  `status` enum('rejected','accepted','shipped','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uk_order_card_id` (`card_id`),
  CONSTRAINT `fk_order_card_id` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `order`;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uk_photo_image_path` (`image_path`),
  KEY `FK_photo_article` (`article_id`),
  CONSTRAINT `FK_photo_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `photo`;
INSERT INTO `photo` (`photo_id`, `article_id`, `image_path`) VALUES
	(5, 4, '2024529-3866372542-hard-disk-slika.jpg'),
	(9, 4, '202461-1011851216-toshiba_hdd.jpg');

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `forename` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `phone_number` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `postal_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_user_email` (`email`),
  UNIQUE KEY `uk_user_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forename`, `surname`, `phone_number`, `postal_address`) VALUES
	(1, 'markomarkovic998@gmail.com', '8F08CFCF0E6002D9A20E0C32061E6ABBBA99B8DDA76F92073D1C04896CD828C5F53FEC53D887E652AEF3B27F0CEF554051841EE77C84292D3C7E34E39D5AA6B2', 'Marko', 'Markovic', '+381606789988', 'Kralja Petra 1, Stari Grad, Beograd.');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
