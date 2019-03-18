-- MySQL dump 10.13  Distrib 5.6.43, for Linux (x86_64)
--
-- Host: localhost    Database: pottito_db
-- ------------------------------------------------------
-- Server version	5.6.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `items`
--
-- ORDER BY:  `id`

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`id`, `name`, `price`) VALUES (12,'カリカリ',800);
INSERT INTO `items` (`id`, `name`, `price`) VALUES (13,'まぐろ',500);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `purchaseHistory`
--
-- ORDER BY:  `id`

LOCK TABLES `purchaseHistory` WRITE;
/*!40000 ALTER TABLE `purchaseHistory` DISABLE KEYS */;
INSERT INTO `purchaseHistory` (`id`, `name`, `price`, `num`) VALUES (31,'鰹節',200,1);
INSERT INTO `purchaseHistory` (`id`, `name`, `price`, `num`) VALUES (32,'ねこじゃらし',500,2);
INSERT INTO `purchaseHistory` (`id`, `name`, `price`, `num`) VALUES (34,'鰹節',200,1);
INSERT INTO `purchaseHistory` (`id`, `name`, `price`, `num`) VALUES (36,'カリカリ',800,1);
INSERT INTO `purchaseHistory` (`id`, `name`, `price`, `num`) VALUES (38,'まぐろ',500,1);
/*!40000 ALTER TABLE `purchaseHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-19  0:32:18
