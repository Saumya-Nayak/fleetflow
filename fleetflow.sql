-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for fleetflow
CREATE DATABASE IF NOT EXISTS `fleetflow` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fleetflow`;

-- Dumping structure for table fleetflow.drivers
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `license_expiry` date NOT NULL,
  `license_category` enum('Truck','Van','Bike','All') NOT NULL DEFAULT 'All',
  `phone` varchar(20) DEFAULT NULL,
  `safety_score` decimal(5,2) DEFAULT '100.00',
  `completion_rate` decimal(5,2) DEFAULT '100.00',
  `complaints` int DEFAULT '0',
  `duty_status` enum('On Duty','Off Duty','Suspended','On Trip') DEFAULT 'Off Duty',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_number` (`license_number`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.drivers: ~5 rows (approximately)
INSERT INTO `drivers` (`id`, `name`, `license_number`, `license_expiry`, `license_category`, `phone`, `safety_score`, `completion_rate`, `complaints`, `duty_status`, `created_at`, `updated_at`) VALUES
	(1, 'Ramesh Patel', 'GJ0120230001', '2026-08-15', 'Truck', '9876543210', 92.50, 100.00, 2, 'On Duty', '2026-02-21 04:26:14', '2026-02-21 05:21:14'),
	(2, 'Suresh Mehta', 'GJ0120220045', '2025-03-01', 'Van', '9876543211', 78.00, 88.50, 5, 'Suspended', '2026-02-21 04:26:14', '2026-02-21 06:20:02'),
	(3, 'Kiran Shah', 'GJ0120240078', '2027-11-30', 'All', '9876543212', 97.00, 99.00, 0, 'On Trip', '2026-02-21 04:26:14', '2026-02-21 05:22:44'),
	(4, 'Ajay Verma', 'GJ0120210099', '2024-06-20', 'Truck', '9876543213', 65.00, 75.00, 8, 'Off Duty', '2026-02-21 04:26:14', '2026-02-21 06:20:00'),
	(5, 'Nilesh Joshi', 'GJ0120230156', '2026-12-31', 'Bike', '9876543214', 88.00, 94.00, 1, 'Off Duty', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(6, 'Vimal', 'GJ020001456', '2026-02-23', 'Van', '9316574729', 100.00, 100.00, 0, 'Off Duty', '2026-02-21 06:18:46', '2026-02-21 06:18:46');

-- Dumping structure for table fleetflow.expenses
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `fuel_liters` decimal(8,2) DEFAULT '0.00',
  `fuel_cost` decimal(10,2) DEFAULT '0.00',
  `misc_expense` decimal(10,2) DEFAULT '0.00',
  `distance_km` decimal(10,2) DEFAULT '0.00',
  `date` date NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.expenses: ~3 rows (approximately)
INSERT INTO `expenses` (`id`, `trip_id`, `driver_id`, `fuel_liters`, `fuel_cost`, `misc_expense`, `distance_km`, `date`, `notes`, `created_at`) VALUES
	(1, 3, 2, 95.00, 11500.00, 2000.00, 680.00, '2025-02-05', 'Highway toll + food', '2026-02-21 04:26:14'),
	(2, 4, 5, 4.00, 480.00, 200.00, 90.00, '2025-02-07', 'Local fuel stop', '2026-02-21 04:26:14'),
	(3, 1, 1, 22.00, 2700.00, 300.00, 270.00, '2025-02-16', 'Fuel at Bharuch pump', '2026-02-21 04:26:14');

-- Dumping structure for table fleetflow.maintenance_logs
CREATE TABLE IF NOT EXISTS `maintenance_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `issue_service` varchar(200) NOT NULL,
  `description` text,
  `cost` decimal(10,2) DEFAULT '0.00',
  `date` date NOT NULL,
  `status` enum('New','In Progress','Completed') DEFAULT 'New',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `maintenance_logs_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.maintenance_logs: ~0 rows (approximately)
INSERT INTO `maintenance_logs` (`id`, `vehicle_id`, `issue_service`, `description`, `cost`, `date`, `status`, `created_at`, `updated_at`) VALUES
	(1, 3, 'Engine Issue', 'Engine overheating, requires coolant flush and belt replacement', 15000.00, '2025-02-15', 'In Progress', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(2, 1, 'Oil Change', 'Routine 40,000 km oil and filter change', 3500.00, '2025-02-10', 'Completed', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(3, 5, 'Tyre Replacement', 'Two rear tyres worn below safe limit', 8000.00, '2025-02-08', 'Completed', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(4, 2, 'Brake Service', 'Brake pad replacement, brake fluid top-up', 4500.00, '2025-02-12', 'Completed', '2026-02-21 04:26:14', '2026-02-21 04:26:14');

-- Dumping structure for table fleetflow.trips
CREATE TABLE IF NOT EXISTS `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `cargo_weight_kg` decimal(10,2) NOT NULL,
  `origin` varchar(200) NOT NULL,
  `destination` varchar(200) NOT NULL,
  `estimated_fuel_cost` decimal(10,2) DEFAULT '0.00',
  `actual_fuel_cost` decimal(10,2) DEFAULT '0.00',
  `distance_km` decimal(10,2) DEFAULT '0.00',
  `status` enum('Draft','Dispatched','On Trip','Completed','Cancelled') DEFAULT 'Draft',
  `start_odometer` decimal(10,2) DEFAULT NULL,
  `end_odometer` decimal(10,2) DEFAULT NULL,
  `revenue` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.trips: ~5 rows (approximately)
INSERT INTO `trips` (`id`, `vehicle_id`, `driver_id`, `cargo_weight_kg`, `origin`, `destination`, `estimated_fuel_cost`, `actual_fuel_cost`, `distance_km`, `status`, `start_odometer`, `end_odometer`, `revenue`, `created_at`, `updated_at`, `completed_at`) VALUES
	(1, 2, 1, 600.00, 'Ahmedabad', 'Surat', 2500.00, 200.00, 45000.00, 'Completed', NULL, 45000.00, 22.00, '2026-02-21 04:26:14', '2026-02-21 05:21:14', '2026-02-21 05:21:14'),
	(2, 1, 3, 5000.00, 'Surat', 'Mumbai', 8000.00, 0.00, 300.00, 'Cancelled', NULL, NULL, 35000.00, '2026-02-21 04:26:14', '2026-02-21 05:21:00', NULL),
	(3, 5, 2, 3000.00, 'Ahmedabad', 'Pune', 12000.00, 11500.00, 680.00, 'Completed', NULL, NULL, 50000.00, '2026-02-21 04:26:14', '2026-02-21 04:26:14', NULL),
	(4, 4, 5, 80.00, 'Rajkot', 'Jamnagar', 500.00, 480.00, 90.00, 'Completed', NULL, NULL, 2000.00, '2026-02-21 04:26:14', '2026-02-21 04:26:14', NULL),
	(5, 1, 3, 7000.00, 'Mumbai', 'Delhi', 18000.00, 0.00, 1400.00, 'Draft', NULL, NULL, 75000.00, '2026-02-21 04:26:14', '2026-02-21 04:26:14', NULL),
	(6, 1, 3, 2500.00, 'Surat', 'Ahmedabad', 6000.00, 0.00, 0.00, 'Dispatched', 45200.00, NULL, 26000.00, '2026-02-21 05:22:44', '2026-02-21 05:22:44', NULL);

-- Dumping structure for table fleetflow.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('manager','dispatcher','safety_officer','analyst') NOT NULL DEFAULT 'dispatcher',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
	(1, 'Fleet Manager', 'manager@fleetflow.com', 'pbkdf2:sha256:600000$admin123hash', 'manager', '2026-02-21 04:26:14'),
	(2, 'Dispatcher Dave', 'dispatcher@fleetflow.com', 'pbkdf2:sha256:600000$dispatch123hash', 'dispatcher', '2026-02-21 04:26:14'),
	(8, 'Dhruvi Khandhar', 'dhruvikhandhar4@gmail.com', 'scrypt:32768:8:1$hHNIUOfYaV37Gb7i$9bba1e653fc33504d44ee768d242ea321d7fdbca41660add3b341572641d416611ddc0154f252bd4dd68d123befe27bdbac47328e5ca2b0bf23571b24be364c7', 'dispatcher', '2026-02-21 05:19:39'),
	(9, 'Saumya Nayak', 'saumyan24@gmail.com', 'scrypt:32768:8:1$i0xB6OebGtyXRuDj$f5cdc1c9226bf67c0680868c30b5682bcf1e0a5f0141092bad4a6c614dcb71c840b49fb84c16dc9adb07e01f2e9983b4d952328c6ce6aa24bc4ca7decb04bdf6', 'manager', '2026-02-21 05:45:48'),
	(11, 'Binita G Vasita', 'binitagvasita@gmail.com', 'scrypt:32768:8:1$2ebPZinxD1klTCFZ$e4b61f0aad3dae5bb8e15be4fee7e1f797a2d1cef483d28947ceba8f3571f0eacab2117d9dca287adcf8073a67a9f5499f32a26f455b020ca95d8c98b28f5a76', 'safety_officer', '2026-02-21 05:55:43'),
	(12, 'Twisha Chauhan', 'twishadchauhan@gmail.com', 'scrypt:32768:8:1$BHa9Gw9VK8YuaOGW$2e112735fa75008541dbc915b1532db03e60b460ec9052b269e5351b49ae2d9cc98a0463f16b0a3fcb112b66c842ec16c1610bdc274741a11e61948366a77192', 'analyst', '2026-02-21 05:59:40');

-- Dumping structure for table fleetflow.vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `type` enum('Truck','Van','Bike') NOT NULL,
  `max_capacity_kg` decimal(10,2) NOT NULL,
  `odometer_km` decimal(10,2) DEFAULT '0.00',
  `acquisition_cost` decimal(12,2) DEFAULT '0.00',
  `status` enum('Available','On Trip','In Shop','Retired') DEFAULT 'Available',
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_plate` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table fleetflow.vehicles: ~4 rows (approximately)
INSERT INTO `vehicles` (`id`, `name`, `model`, `license_plate`, `type`, `max_capacity_kg`, `odometer_km`, `acquisition_cost`, `status`, `region`, `created_at`, `updated_at`) VALUES
	(1, 'Tata Prima', 'Prima 4028.S', 'GJ-01-AB-1234', 'Truck', 8000.00, 45200.00, 1800000.00, 'On Trip', 'Ahmedabad', '2026-02-21 04:26:14', '2026-02-21 05:22:44'),
	(2, 'Tata Ace', 'Ace HT', 'GJ-01-CD-5678', 'Van', 750.00, 45000.00, 550000.00, 'Available', 'Surat', '2026-02-21 04:26:14', '2026-02-21 05:21:14'),
	(3, 'Mahindra Furio', 'Furio 14', 'GJ-05-EF-9012', 'Truck', 6000.00, 61000.00, 1200000.00, 'In Shop', 'Vadodara', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(4, 'Hero Splendor', 'Splendor+', 'GJ-07-GH-3456', 'Bike', 100.00, 8500.00, 75000.00, 'Available', 'Rajkot', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(5, 'Ashok Leyland', 'BOSS 1615', 'GJ-02-IJ-7890', 'Truck', 10000.00, 92000.00, 2200000.00, 'Available', 'Gandhinagar', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(6, 'Bajaj RE', 'RE Maxima', 'GJ-01-KL-2345', 'Bike', 250.00, 15300.00, 200000.00, 'Available', 'Ahmedabad', '2026-02-21 04:26:14', '2026-02-21 04:26:14'),
	(7, 'Rugged/SUVs', '320', 'GJ-01-G-1660', 'Bike', 30000.00, 25.00, 1700000.00, 'Available', 'Surat', '2026-02-21 05:48:55', '2026-02-21 05:48:55'),
	(8, 'Giga', '6078', 'GJ-01-G-1690', 'Truck', 30000.00, 25.00, 1700000.00, 'In Shop', 'Surat', '2026-02-21 06:18:03', '2026-02-21 06:18:10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
