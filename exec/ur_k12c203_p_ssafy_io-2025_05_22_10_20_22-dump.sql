-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: k12c203.p.ssafy.io    Database: ur
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `album`
--

DROP TABLE IF EXISTS `album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album` (
  `album_id` int NOT NULL AUTO_INCREMENT,
  `type` enum('CLASS','PERSONAL') NOT NULL,
  `title` varchar(100) NOT NULL,
  `create_at` date NOT NULL DEFAULT now(),
  `child_id` int NOT NULL,
  `classroom_id` int DEFAULT NULL,
  PRIMARY KEY (`album_id`),
  KEY `FK_child_TO_album_1` (`child_id`),
  KEY `album_classroom_classroom_id_fk` (`classroom_id`),
  CONSTRAINT `album_classroom_classroom_id_fk` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`classroom_id`),
  CONSTRAINT `FK_child_TO_album_1` FOREIGN KEY (`child_id`) REFERENCES `child` (`child_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album`
--

LOCK TABLES `album` WRITE;
/*!40000 ALTER TABLE `album` DISABLE KEYS */;
INSERT INTO `album` VALUES (7,'PERSONAL','Doo 2025-05-20','2025-05-20',4,1),(10,'PERSONAL','hyun 2025-05-21','2025-05-21',6,3),(11,'PERSONAL','woo 2025-05-21','2025-05-21',5,2),(12,'PERSONAL','Doo 2025-05-21','2025-05-21',4,1),(13,'PERSONAL','Doo 2025-05-22','2025-05-22',4,1);
/*!40000 ALTER TABLE `album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `album_file`
--

DROP TABLE IF EXISTS `album_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album_file` (
  `album_id` int NOT NULL,
  `file_id` int NOT NULL,
  PRIMARY KEY (`album_id`,`file_id`),
  KEY `FK_file_TO_album_file_1` (`file_id`),
  CONSTRAINT `FK_album_TO_album_file_1` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`),
  CONSTRAINT `FK_file_TO_album_file_1` FOREIGN KEY (`file_id`) REFERENCES `file` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album_file`
--

LOCK TABLES `album_file` WRITE;
/*!40000 ALTER TABLE `album_file` DISABLE KEYS */;
INSERT INTO `album_file` VALUES (7,12),(7,14),(7,15),(7,16),(7,17),(7,19),(7,21),(7,22),(10,38),(11,39),(11,40),(11,41),(10,48),(11,49),(11,50),(12,51),(10,52),(10,53),(12,54),(12,55),(12,56),(11,60),(12,61),(13,63),(13,64);
/*!40000 ALTER TABLE `album_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `checked_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `child_id` int NOT NULL,
  `attendance_type` enum('AM','PM') DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `child` (`child_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (15,'2025-05-19 06:27:08',5,'AM'),(28,'2025-05-20 08:16:37',4,'AM');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child`
--

DROP TABLE IF EXISTS `child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child` (
  `child_id` int NOT NULL AUTO_INCREMENT,
  `class_room_id` int NOT NULL,
  `child_name` varchar(50) NOT NULL,
  `birth_dt` date NOT NULL,
  `gender` enum('FEMALE','MALE') NOT NULL,
  `contact` varchar(11) DEFAULT NULL,
  `profile_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`child_id`),
  KEY `class_room_id` (`class_room_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`class_room_id`) REFERENCES `classroom` (`classroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child`
--

LOCK TABLES `child` WRITE;
/*!40000 ALTER TABLE `child` DISABLE KEYS */;
INSERT INTO `child` VALUES (1,2,'ê¹ì¸í¼','2020-05-14','FEMALE','01056785768','/2025/05/19/1256933b-a684-4bcb-9f72-39fbd0e58e04.jpg '),(4,1,'Doo','2018-05-10','MALE','01022222222','/2025/05/21/26039331-b2f1-4fd4-8a0c-12071a30747d.png'),(5,2,'woo','2020-05-02','MALE','01033333333','/2025/05/21/7274534b-0939-4332-81cc-8c12635cfdfb.jpg'),(6,1,'hyun','2025-05-19','MALE','01044444444',NULL),(9,3,'yong-hyun','2018-05-04','MALE','01098765678','/2025/05/21/fece1545-2d3c-425f-bcd1-4e36cc7c25c4.jpg'),(10,3,'moo-sung','2020-05-02','MALE','01012353478','/2025/05/21/947ff713-3069-49a7-92e7-276f575d429f.jpg'),(11,2,'dong-uk','2021-05-04','MALE','01045628596','/2025/05/21/7fe4d910-79d6-403c-badb-06f7e82f04b4.png');
/*!40000 ALTER TABLE `child` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_stuff`
--

DROP TABLE IF EXISTS `child_stuff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_stuff` (
  `child_id` int NOT NULL,
  `stuff_id` int NOT NULL,
  PRIMARY KEY (`child_id`,`stuff_id`),
  KEY `fk_stuff` (`stuff_id`),
  CONSTRAINT `fk_child` FOREIGN KEY (`child_id`) REFERENCES `child` (`child_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stuff` FOREIGN KEY (`stuff_id`) REFERENCES `stuff` (`stuff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_stuff`
--

LOCK TABLES `child_stuff` WRITE;
/*!40000 ALTER TABLE `child_stuff` DISABLE KEYS */;
INSERT INTO `child_stuff` VALUES (4,1),(6,1),(4,6),(6,6),(6,7);
/*!40000 ALTER TABLE `child_stuff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `classroom_id` int NOT NULL AUTO_INCREMENT,
  `classroom_name` varchar(50) NOT NULL,
  `profile_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`classroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES (1,'ë°°ì ìë¨',NULL),(2,'ì¸í¼1ë°',NULL),(3,'ì¸í¼2ë°',NULL),(4,'ì¸í¼3ë°',NULL);
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `face_embedding`
--

DROP TABLE IF EXISTS `face_embedding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `face_embedding` (
  `child_id` int NOT NULL,
  `file_id` int NOT NULL,
  `embedding` blob NOT NULL,
  `create_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`child_id`,`file_id`),
  KEY `file_id` (`file_id`),
  CONSTRAINT `face_embedding_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `child` (`child_id`),
  CONSTRAINT `face_embedding_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `file` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face_embedding`
--

LOCK TABLES `face_embedding` WRITE;
/*!40000 ALTER TABLE `face_embedding` DISABLE KEYS */;
INSERT INTO `face_embedding` VALUES (4,1,_binary '\ôW»B0=¿`%¼U=V=Á½Á=ÿÙ¼S\é<4G=WrC<¿`%<n=Á=u\ò=R\Ó{=¹p:i4;ø¼¼\ö\Ê<ÿ\Ù<\ò\")=¹pºZÜ<ø<S\é<\ñ\í»<WrC<\îa<WrC<\îa¼¤J¶=¿`%<Á=U=V=u\ò=X§0=ZÜ<\ò\")=\ôW;\îa¼\'\Z\Z=Á=Á=\õ=%\å¬<\ôW»¿`%<\îa¼ÿ\Ù<\ôW;ø<\õ=\ÙA§=ø<S\é<\ôW»ZÜ<R\Ó{=ÿ\Ù<\õ=(O¼<X§0=¹p:(O<\ò\")=R\Ó{=Ó¼ÿ\Ù<i4;ÿ\Ù<\Êl=\ï¸N½4G=ø<Ü«=WrC<(O<¾+8=¿`%<i4»Ü«=Ü«=U=V=WrC<4G½[=\ò\")=\ôW;ÿ\Ù<WrC<¿`%¼»Á]=X§0=ø<WrC<\ñ\í»<¿`%<\îa<\ò\")=%å¬¼ø<[=WrC<\ï¸N=!=\ôW;Á=i4;»Á]=»Á]=S\é<u\ò=!=\ñ\í»<!=B0=\ÙA§=¿`%<(O<¹p:WrC¼\Úv=\ñ\í»<¦£=R\Ó{=n=$°?=ø<ÿ\Ù<u\ò=s½=i4»i4;[=s½=ZÜ<\ôW;$°?=ÿ\Ù<¿`%¼\õ½¼\ö\Ê<\ñ\í»¼Ó<¿`%<\ñ\í»¼\Êl=X§0=B0=\ìNt=Ó<R\Ó{=\îa<\'\Z\Z=Ó<Ó<X§0=µ?>¹p:¹p:(O<¹p:\'\Z\Z=(O<s½=\ò\")=»Á]=\ò\")=Á=¿`%<Ó<¹pº$°?½pS\Å=4G=\õ=s½=Sé¼!½Ü«=!Fe=¹p:$°?½Á=\ñ\í»<¹p:¦£½[=[=ZÜ<$°?=!Fe=¼B0½¹pº\ñ\í»<\ôW;\îa<!Fe=ZÜ<¦£=¿`%<\ñ\í»¼<i4»Ó<R\Ó{=\r9=B0=%\å¬<\ÙA§=\õ=\Úv=¹p:<\"{\Ò;%å¬¼\ñ\í»<\ò\")=¼Ü«=\ò\")=R\Ó{=$°?=?Æ®=ÿ\Ù<\'\Z\Z=ZÜ<^>Á=[=\'\Z\Z=\nÏ½=X§0½<¹p:[=[=\'\Z\Z=\ìNt=\"{\Ò;U=V=Á==Á=<ÿ\Ù<ÿ\Ù<(O<s½=u\ò=\ôW;i4;(O<WrC<¿`%<%\å¬<\îa¼<»Á]=\Êl=¹p:S\é<U=V=\õ=Á=X§0=\nÏ½=ZÜ<Ü«=S\é<\îa¼ø<<\'\Z\Z=WrC<\ìNt=WrC¼¿`%¼ZÜ<¼\ö\Ê<Á=4G=\'\Z\Z=Ü«=$°?=§´=\õ½\'\Z\Z=¹p:¹p:Ó¼¾+8=<ÿ\Ù<ÿ\Ù<\ìNt=\ò\")=ZÜ<WrC<\ï¸N=\"{\Ò;WrC<$°?½¤J¶=[=ÿ\Ù<\ò\")½X§0=s½=\ò\")=%\å¬<\ÙA§=B0=\ñ\í»¼4G=<(O<¾+8=$°?=(O<¾+8=\'\Z\Z=\nÏ½=$°?=¹p:¹p:%\å¬<\'\Z\Z=WrC¼ÿÙ¼¤J¶=\îa<\ìNt=¦£=\Êl=[=\Ö\×\Ì=\ñ\í»<<S\é<WrC<\ôW;X§0=ø<\ñ\í»<$°?=!Fe=¼$°?=¿`%<\"{\Ò;<Á=U=V=\îa<<ÿ\Ù<»Á]=¿`%<\'\Z\Z=»Á]½i4;WrC<\ôW;«=¼\ö\Ê<!=4G=(O<\r9=\Úv=Ó<H>\ìNt=¹pº(O¼\ï¸N=ÿ\Ù<\'\Z\Z=\Êl=¿`%<¤J¶=(O<n=U=V=!=\ñ\í»¼U=V=¤J¶=WrC<\r9=i4»[=%\å¬<\õ=\ò\")=!=\ò\")=¹pº!Fe=¼\ö\Ê<U=V=ÿ\Ù<n=\r9=§´=!Fe=ÿÙ¼\"{Ò»%\å¬<¹pº\"{\Ò;S\é<\îa<»Á]=\Êl=[=¾+8=U=V=\ò\")½i4»%\å¬<\ï¸N=ÿ\Ù<\îa<§´=\îa<ZÜ<[=\ôW»:\'\ç=ø<X§0½4G=ZÜ<4G=Ó<s½=¹p:\õ=\'\Z\Z=4G½Ó<¿`%¼¤J¶=ZÜ<£\É=\ôW;$°?=<$°?=%\å¬<!½u\ò=\ÙA§=i4»s½=¤J¶=Ó<\ñ\í»<S\é<»Á]½%\å¬<\"{\Ò;!Fe=\"{Ò»<\ï¸N=\ìNt=<\\\Ô=\îa<¹pºB0=\ñ\í»<?Æ®=Ü«=i4»»Á]=n\Ø=Á=\'\Z\Z=ÿÙ¼R\Ó{=\ï¸N=¼\ö\Ê<%å¬¼§´=\Úv=[=¹p:\ìNt½«=B0=\r9=¾+8=S\é<[=	\Ð=S\é<n=\ôW;ZÜ<ÿ\Ù<Ó<<4G=§´=»Á]=¼\öÊ¼Á=¾+8=','2025-05-19 17:44:50'),(5,1,_binary 'c¬»Q ¼\í­=\Ñr<Ev;ÿ®=¹´=3,\Ë<©±=\Ã»³²<î¼?ÿ½n;¦<Q ¼³²¼9mü<Ü\n=î<ÿ®=³\Ìã¼¼^½\â\Ç;=3,Ë¼3,\Ë<1s=³²¼\åm=¢w/=9mü¼\"H=\ðA=c¬»¤Ý»;¶\Ì=Ñ³8<O)=QTQ<ehT=Â5=®J<¢w/=\óÛ¾<³\Ì\ã<¤Ý»\Õü=\\\ÞÒ½c¬»\Õü=î<³\Ì\ã<VE:\Õü=\Ñr<\Ù=º=¤Ý»î<n;¦<.\ë<Ñ³8<1s=xÅ§=\÷$=¤\Ý;î<\ðA=Ev;³\Ì\ã<?ÿ½QTQ¼\×=î¼Ü\n=¥¸`=Ev;ù\ð<3,\Ë<¼^=\É)·=s|×¼s|×¼\Å\àf=ùeÀ=3,\Ë<Ü\n=³²¼QTQ<\É)·=O)½\Ñr<3,\Ë<_\'#=³²¼\Ñ\ôi<Z=xÅ§=¤Ý»Ü\n=Ev;s|×¼³²<Q <3,Ë¼¼^=¤\Ý;®J<ù\ð<¤\Ý;³\Ì\ã<\óÛ¾<ÿ®=Ñ³8<Â5=G=QTQ<\Ñ\ôi<\÷$=B@N½\Ñ\ôi<\"H=s|\×<\Ñ\ôi¼³²<9=©±=¤\Ý;ù\ð<®J<\óÛ¾<QTQ<H=\â\Ç;=\Ñ\ôi¼\â\Ç;=\â\Ç;=QTQ<\"H½î¼\"H=\Å\è=_\'#=VEº®J<\"H½ehT=Ñ³8<´Ô=©±=\í­=î<¼^=³\Ì\ã<³\Ì\ã¼\"H=VEº\óÛ¾¼¼^½\'a½\Õü=s|×¼xÅ§=\â\Ç;=ÿ®½³\Ì\ã<Z=Â5=Ùª=_\'#=\Ñr<¼^=Ev;_\'#=Ev;Ñ³8¼n;¦<\åm=Ev;Â5=\Ñ\ôi¼¥¸`½s|\×<¤Ý»\×½\Ã;´Ô=Ev;Â5=ÿ®½\Ã;³²<\"H=Ü\n½\â\Ç;=VE:®J<\Å\àf=\Ã;n;¦¼³²<\×=Ev;(Yy=¤\Ý;B@N½n;¦<1s=Ü\n=_\'#½_\'#=\'a=M=.\ë<¢w/=¼^=\Ã»\â\Ç;=c¬»³²¼H=QTQ<Q <\å=´Ô=É­>¼^½\"H=QTQ<\Ã;B@N=Z=Q <3,\Ë<\óÛ¾<©±=s|×¼M=\Ã;¼^=\óÛ¾<\Ã»VEº\Ñr¼\Ã»\Õü=¢w/=\"H=®J¼.\ë<\×½Z½®J¼9mü<Ùª=l\ò\Õ=Ü\n=¤Ý»³²<\åm½Ñ³8<\åm=G=Q <\â\Ç;=1s=¥¸`=\Ñr<1s=\åm=ù\ð<®J<VE:³²<\í­=Q ¼Z=³\Ì\ã<´Ô=O)=ÿ®½s|\×<\Õü=\Õü=\Ñr¼ù\ð<\ðA=Â5½\í­=VE:\ðA=.ë¼\Ñr¼s|×¼_\'#=¤\Ý;;¶\Ì=n;¦<\"H=ù\ð<\Z\Ü=VEº\×=VEº³²<B@N½½V\å=Â5=Ñ³8¼Ev;c¬;\åm=9=\×=Q <¥¸`=_\'#=Ñ³8<Â5=c¬;Ü\n=¤Ý»VEº´Ô=O)=®J<s|\×<\Ã»9mü<O)½	z\Ã=\Ã;3,\Ë<Ü\n½ù\ð<H=\É)·=\óÛ¾<3,\Ë<¥¸`=î<1s=¼^=M=Ü\n=s|\×<\Ñ\ôi¼Ev»3,\Ë<9mü<n;¦<VE:(Yy=\óÛ¾<\åm=®J¼Ü\n=VE:(Yy=O)=\"H=\Ã;W¡=VEºQ <H½3,\Ë<\"H=W¡=3,\Ë<\Ñr¼Ü\n=\"H=î<s|\×<|\Ù=\ðA=\Å\àf=O)=\"H=QTQ<xÅ§=\Ñr<s|×¼Ùª=\Ñr¼c¬»Ev»¥¸`=ehT½\Ã;Ü\n=¢w/=O)=ÿ®=3,\Ë<9mü<\óÛ¾¼_\'#=\ðA=QTQ<î¼´Ô=ÿ®=s|×¼c¬;´Ô=î<Ü\n=s|\×<B@N=1s=ù\ð<\â\Ç;½\É)·=³\Ì\ã<h±¤=ùeÀ=\Æ=\'a=®J¼\åm=?ÿ½ehT=î<\â\Ç;=\Å\àf=\Ã;\Ñ\ôi¼\Ã»ÿ®=.\ë<(Yy=Ùª=\â\Ç;=ù\ð<¢w/=\Ã;Q <9mü<ùeÀ=3,Ë¼G=¼^½®J¼\Ñ\ôi<9=Z=(Yy=s|\×<c¬;	z\Ã=B@N=H=®J¼1s=\å=n;¦<.ë¼9mü<7u=VEº\×=Â5=.\ë<ù\ð¼Q ¼½V\å=QTQ<Q <\×=¢w/=\ðA½\"H=Ev»H=Ü\n½\×=\"H=QTQ<ehT=¢w/=\÷$=\"H=Ñ³8<³\Ìã¼Z=\÷$=\óÛ¾¼\óÛ¾<M=n;¦<H=ÿ®=.\ë<_\'#=O)=\ðA=Ü\n=\Ñr¼¤\Ý;Â5=	z\Ã=3,Ë¼ehT=\Å\àf=Ü\n=Q <9mü<ehT=ù\ð<Ñ³8¼\Ñ\ôi¼\ðA=','2025-05-20 06:54:43'),(6,1,_binary 'x¼ª½¼\0T=\ô=­=^l<Í;\ÜHQ:¡h¨=ª½¼ì£<bAu=O4D<­½ª½<¾Ê¼¥\ö»øq\ë;Á·»\ð=\ÑW¼O4D<\ô=¥\ö;O4D<\ô=ryG=?ü\ñ<©\Ë{=z°<\ÜHQºj]^<z°¼\ô=©\Ë{=øq\ë;Á·;·n=#\Ó\×<8²=?µ=ø*=ø*=#\Ó\×<;\'=Í;#\Ó×¼ryG=bú=\É; =\Íÿ<øq\ë»j]^<\Íÿ<¥\ö;\â<\äd:=±=ª½<x¼~#¥=\ÑW<O4D<¥\ö»^l¼p=bú=Á·;­=\ÍÉ=\É; =±=;\'=x<±=WP-=3*<^l¼\äd:=z°<j]^<¢a=\Ï>?ü\ñ<#\Ó\×<\äd:½x<©\Ë{=\â<?µ=;\'½ª½<\Ú3=bú=?ü\ñ<±=¥\ö;¥\ö»n\ë\Ò=±\ç\ä<3*<\É; =?ü\ñ¼^l¼Á·»øq\ë;\Õ,h½\â<¥\ö;#\Ó×¼;\'=#\Ó\×<3*¼#\Ó\×<­½x<+\ï@=#\Ó×¼\â<ryG=\ÜHQ:x<ø*=p=\è\ò®=Á·;\0T=\ð=±\ç\ä<¾\Ê<\â¼#\Ó\×<Á·;©=¾Ê¼øq\ë;SÂ¸=;\'=\É; =ø*=\É; =?ü\ñ<?ü\ñ<z°<WP-=/}µ=^l¼±=Á·;\â<\ÍÉ=bAu=WP-½3*<bú=^l¼\ÜHQº7=Ñ\ó=Í;¥\ö;+\ï@=¹N=\ÜHQ:#\Ó\×<\Íÿ<x<x<?=¹N=¹N=?ü\ñ<x¼\â<ª½<;\'½¾\Ê<\ÜHQ:·n=j]^<?ü\ñ<øq\ë;T½#\Ó×¼\è\ò®=#\Ó\×<p=\ô½#\Ó\×<^l<WP-=;\'=\Ú3=ZÞ¡=ì£<j]^<\É; =#\Ó\×<?=\ð=\â¼ø*=x<3*¼G[=ª½<~#¥=Í;3*<\ÍÉ=Á·»\â<±\ç\ä<bAu=¾\Ê<?µ=WP-=3*<?=\ÜHQºWP-=·n=j]^¼j]^<\â<WP-=~#¥=\ð=3*<©\Ë{=\â<Á·;~#¥=v¼=ì£<\Æ&=\ð=j]^<ryG=\ÍÉ=?ü\ñ<j]^<±=L¿=7=L¿=ì£<z°<\ÜHQºG[=\ÍÉ=\Æ&½ZÞ¡½ì£<;\'=\â¼3*¼j]^<¥\ö;\Ú3=ryG=\â¼±=z°¼ì£<ZÞ¡=\äd:=\'a\Ì=ª½<z°<¾\Ê<#\Ó\×<bú=\ô=\É; =z°<\Æ&=\0T½\äd:=ì£¼?µ½+\ï@=^l<\ÜHQ:\ÜHQ:\â¼?ü\ñ<?ü\ñ¼\â<\ÜHQºª½¼±=\É; =G[=WP-=\ô=j]^¼?ü\ñ<WP-=z°¼\Íÿ¼¥\ö;x<¡h¨½\ÑW<;\'=±=\â<\ÑW<z°<\ð=\0T=?=ø*=WP-=z°<©=#\Ó×¼·n=z°<\ð=±\ç\ä<ryG=\Õ,h=;\'=Í;x<O4D¼Í»Á·;\0T=+\ï@=\ð=bAu=?µ=\ÍÉ=\ÑW<Øº\Ü=\ÑW<øq\ë;±\ç\ä<±=?ü\ñ¼7=ì£<3*¼\É; =x<±\ç\ä¼^l<\Ú3=?µ=¡h¨=±\ç\ä¼z°<\ÜHQºx<¾\Ê<Á·»\äd:=?ü\ñ<øqë»©=;\'=ryG=±\ç\ä<\Æ&=Á·»3*¼Á·»^l<\0T=Í»±\çä¼¯Y\0>ì£<­=\äd:=Í;\Ú3=øq\ë;¥\ö»\Õ,h=ì£<WP-½¾\Ê<\Ú3=j]^<bAu=bú=O4D¼+\ï@=z°¼x¼Í;ryG=\ÜHQ:+\ï@=\0T=#\Ó\×<x¼\ÍÉ=\ÜHQºG[=#\Ó\×</}µ=+\ï@=^l¼øq\ë;±½Á·»±=3*<?ü\ñ<¢a=øq\ë»Å­«=\à\Ö\Å=Á·»\ô=j]^¼ì£<¹N=©\Ë{=j]^<±½\ô=G[=?=ª½<O4D¼\'a\Ì=O4D<¾\Ê<\ð=z°<\ÑW¼¹N=\Æ&½üÿ\ß=;\'=^l<j]^<øq\ë;\É; ½ì£<WP-=7=\ÜHQ:Å­«=¾Ê¼\0T=øq\ë;\äd:=~#¥=3*<z°¼\ð=\'a\Ì=^l¼ì£<\â<\äd:=\â¼\ô½O4D¼±\ç\ä<v¼=\0T=¹N=ø*=\É; =ì£<ª½<¢a=3*<ø>\ÜHQ:bAu=\ÑW<?µ=\ÜHQº\Æ&=\Íÿ<\Ú3=x<x¼¢a=\Ú3=?µ=©\Ë{=\äd:=C\æ=\Õ,h=L¿=j]^<\Íÿ<ª½¼+\ï@=Í»\ÜHQ:\â<±\ç\ä¼øq\ë;^l<3*¼\Æ&=j]^<G[=¥\ö»?ü\ñ<\ÍÉ=','2025-05-19 17:41:47'),(6,2,_binary 'BE³<;;\Õ<lR±=9\'=®£<ý=BE³¼lR±=®£<_/=vºm=M\ö>=Y§J<! \ñ<tL¼BE³<\Þ\È=tL¼b¡¥=\Éf=\ïe½\Þ\È=\Éf=_/=\Å\Ôi<BE³<ª\n=ª\n=aXV=_/=ý\Û\Â<\Õ<Y§J<<;»\Þ\È=N=_/=ý\Û\Â<9\'=j	\â<vºm=\Å\Ôi¼BE³<<5\ã;M\ö>=\ò*7=D=ý=j	\â<\ìy+<M\ö>=Ö=´rÒ¼n\0=\Þ\È=9\'=¨ÁF=\Éf=v½=\ò*7=n\0=\ìy+<_/=®£<ý=¨ÁF=vºm=<\Õ<;»\Õ<! \ñ<M\ö>=ý=<X\ð=>Ú»ý\Û\Â<n\0=¿l­=Ñu=\Þ\È=N?½Y§J<®£<BE³¼>\Ú;5\ã;,Q}=N=fkyºtL¼>Ú»fky:N=¨ÁF=%2=%2=ª\n=\Õ¼ý\Û\Â<\ò*7=Y§J¼tL¼\Õ<5\ã;! \ñ<\ò*7=tL<\Éf=û$=_/=ý\Û\Â<´r\Ò<>Ú»®£<ª\n=BE³<\Þ\È½\Õ<5\ã;.\Ì=! \ñ<N?=N?=n\0=\Éf=BE³¼D=b¡¥=.\Ì=j	\â<®£¼vºm=n\0=½#^=vºm=\ïe=j	\â<ª\n=n\0=_/=½#^=®£<b¡¥=\Éf=\Éf=\ós=<\Å\Ôi¼Ñu=\ò*7=û$½>Ú»5\ã;lR±=! \ñ<\ìy+¼Ö=ý=tL<aXV=%2=>Ú»M\ö>=\ò*7=;;½#^=¿l­=n\0=Y§J¼9\'=5ã»N=ý\Û\Â<\ò*7=fky:tL<\ós=;;M\ö>=%2=\Å\Ôi¼ý\Û\Â<Y§J¼Y§J<<%2=Y§J<! \ñ<BE³<_/=N=½#^=®£¼j	\â<e\Ô=ý\Û\Â<vºm=\Å\Ôi<n\0½n\0=®£<lR±=_/=\Å\Ôi<,Q}=\ìy+<ª\n=;;½#^=>Ú»j	\â<ý\Û\Â< Y=½#^=®£<N=%2=û$=N=®£<%2=N=\Å\Ôi¼\ìy+<vºm=aXV=tL¼aXV=ª\n=>Ú»½#^=¨ÁF=fky:\ìy+<9\'=%2=´r\Ò<>\Ú;\Ç¹=,Q}=\ìy+<N=ý=fky:\Þ\È=Y§J<5ã»\ìy+<\Å\Ôi< Y=\ìy+<©=\Å\Ôi<\Å\Ôi<D=¿l­=\Õ<vºm=Y§J<M\ö>=\Ç¹=v½=û$=\Ç¹=\Õ<Y§J<<\ós=\Õ<D=fkyº<aXV=_/=\ò*7=M\ö>½\ò*7=<;;ý=_/=\ìy+<M\ö>=\ìy+<fky:tL<\Éf=®£<ª\n=´»¡=,Q}=_/=>\Ú;½#^=%2=>Ú»tL<N=Y§J¼n\0=ý\Û\Â<<%2=n\0= Y=,Q}=\æ0\Ü=¿l­=\Þ\È=\Õ<9\'=ý\Û\Â<Y§J<\ós=\ïe=¿l­=%2=\ós= Y=\ò*7=<%2=®£<©=¨ÁF=\Þ\È=%2½vºm=b¡¥=N=N?=½#^=lR±=ý=\Å\Ôi<N=%2=fky:\Å\Ôi<n\0=\Å\Ôi<_/=%2=fky:ý=\Éf=N=b¡¥=%2=fky:;»%2=N?=\ò*7=_/=%2=fky:>\Ú;½#^=ª\n=\Å\Ôi¼,Q}=ý=<;;lR±=¿l­=N=\ìy+<\ós=\ò*7=M\ö>=vºm=j	\â<aXV=fkyºý\Û\Â<´»¡=\ìy+¼\ìy+<%2=\Z8µ=<,Q}=\ò*7=>Ú»\ò*7=tL<®£<<tL<¼,Q}=9\'=M\ö>=\Õ<_/=tL<n\0=\Þ\È=\Å\Ôi<_/=j	\â<¼%2½Y§J<®£<n\0=\Éf=j	\â<9\'=BE³<aXV=¨ÁF=b¡¥=½#^½D=5ã»N=D=¼½#^=>Ú»,Q}=5\ã;! \ñ<\ós=\Éf=ý=\ïe=>\Ú;½#^½%2=\ïe=n\0=\ìy+<\ìy+<5\ã;_/=\Õ¼\Éf=\Þ\È=vºm=M\ö>½lR±=ý\Û\Â<\Þ\È=BE³¼%2=N=n\0=n\0=N?=%2=fkyº_/=´r\Ò<M\ö>=j	\â¼\ìy+¼Y§J<tL<D=vºm=\ós=5\ã;5\ã;\ìy+<_/=n\0=®£<Ö=Y§J<Ö=\ïe=N=M\ö>=aXV=\Éf=\Å\Ôi<tL<n\0½Y§J<<_/=Ñu=N=ª\n=ý\Û\Â<5`	>©=©=9\'=\ò*7=>\Ú;5ã»\Þ\È=fky:\ìy+¼Ñu=%2=©=\ìy+¼%2=tL¼Y§J¼ý\Û\Â<','2025-05-21 07:17:26'),(6,3,_binary '¦;_½\æ/a=[ýp=\à2=¡=»<Ý»U\Å<G¿=<Ý»\æ/a=²{I=¸\ð\ô<\ÔE\n=e\í¥<nbQ=<\Ý;L\Z½<\Ý;je=¡=;,\×|:_=\ÔE\n=ú!=UÅ¼i=¸\ð\ô<[ýp=E#\å<\í<¡=»¸\ð\ô<¸\ð\ô<[ýp=\í<<\Ý;?&=*IY=nbQ=¦;,=ú!=~\Ç1=?&=<Ý»U\Å<ù	m¼\ÔE\n=~\Ç1=_=e\í¥¼_=\ÍU\Õ<:®9=\í¼\ÔE\n=,=$\Ô-<$\Ô-<nbQ=ú!=,=\í¼,\×|:²{I=?=¸\ð\ô<ú!=´·=nbQ=<\Ý;39¼¸\ð\ô¼\ÔE\n=U\Å<E#\å<¡=»\à2=¦;,=E#\å<\Ç=E#\å<U\Å<<Ý»\ÍU\Õ<\ç§=¦»,\×|ºÝºµ¼ú!=¸\ð\ô<U\Å<je=\ÔE\n=uR<,\×|º*IY=:®9=39<?=\äx½U\Å<\öA=Ýºµ<i½ù	m<$\Ô-<¡=»L\Z=,=\í<$L=ù	m<¦»²{I=39¼uR<je=39<oM¼sÚ«=$\Ô-¼¾h\Ï=L\Z=39<\ÔE\n=\ÔE\n=Ýºµ<oM<ù	m<\í¼nbQ=¦»¦;je=[ýp=E#\å<i=:®9=uR<[ýp=²{I=¡=»?&=ù	m¼~\Ç1=<Ý»E#\å<G¿=\ÍU\Õ<¸\ð\ô¼sÚ«=\ÔE\n=¡=»\Ä\à)=[ýp=i\ê\ö=$\Ô-<\ÍU\Õ<je=\ÍU\Õ<¦»E#\å<\ÍU\Õ<uR¼nbQ=\äx=\ÔE\n=E#\å<nbQ=e\í¥<uR<L\Z=e\í¥¼E#\å<¦;:®9=¡=»~\Ç1=~\Ç1=,½¦;nbQ=U\Å<¡=;¸\ð\ô¼\ÍU\Õ<L\Z=,\×|:39<\ÈX=39<E#\å<,=\ç§=_=nbQ=zO\×=¦;$L=e\í¥<¦;uR<\ÔE\n=\ÏÍ¯=\à2=uR¼~\Ç1=e\í¥<ú!=~\Ç1=-Á³=\öA=_=[ýp=,=sÚ«=uR<U\Å<\öA=,\×|:¸\ð\ô<uR<Ýºµ<bu\Ë=ú!=¦;\öA=<\Ý;\ÔE\n=\à2=´·=oM¼¸\ð\ô<\öA=¸\ð\ô<¸\ð\ô<\æ/a=?=E#\å<ú!=\à2=é§»=\æ/a=\æ/a=[ýp=_=nbQ=\Ä\à)=Ýºµ¼i½U\Å<nbQ=$\Ô-<*IY=U\Å<Ýºµ<ú!==¡=»nbQ=,=¡=»G¿=²{I=\à2=¸\ð\ô<Ýºµ<\í<\í¼·\ó£=i=$L=\ÔE\n=:®9=¡=»?=U\Å<\äx½*IY=oM<,\×|ºoM<\ÈX=\ÍU\Õ<E#\å<\í<<Ý»\Ä\à)=nbQ=?&=zO\×=\äx=*IY=$\Ô-¼Ýºµ<L\Z=¡=»$\Ô-¼$\Ô-<E#\å<[ýp½e\í¥<U\Å<L\Z=\ÍU\Õ<ù	m<[ýp=\à2==\ØB\Û=e\í¥<\öA=\ÔE\n=$L=$\Ô-<\à2=,=\äx=¸\ð\ô<²{I=ú!=\Ä\à)=¦;Ýºµ<E#\å<:®9=ù	m<\ÈX=\öA=¦;L\Z=*IY=66\ß=,=û=,\×|ºoM<L\Z=je=¸\ð\ô¼\à2=~\Ç1=¸\ð\ô<~\Ç1=Ýºµ<uR¼\í<oM<_=û=\í¼U\Å<L\Z½\í<e\í¥<ù	m¼,\×|º[ýp=uR<\à2=:®9=i=¸\ð\ô<_=U\Å<,\×|ºe\í¥<uR<$\Ô-<$\Ô-<\ÍUÕ¼\\\Ó=¡=;\æ/a=~\Ç1=$\Ô-<\Ä\à)=¡=;uR¼\à2=,=¡=»¸\ð\ô<?=¡=;uR<\à2=UÅ¼nbQ=$\Ô-¼¦»¦»\Ä\à)=~\Ç1½\ÈX=i=~\Ç1=:®9½·\ó£=uR<i=uR<E#\å<,\×|:¡=;uR<²{I½$\Ô-¼E#\å<E#\å<\í<L\Z=\öA=ú!=\÷\ò=\Ä\à)=i=\í¼[ýp=\í<Y\0 =Ýºµ<39<\ÍU\Õ<i=\äx=ù	m<e\í¥¼O\ë=nbQ=*IY=\ç§=U\Å<E#\å¼\ÍU\Õ<oM¼zO\×=$\Ô-<\ÈX=~\Ç1=L\Z=\à2½\Ä\à)=nbQ=sÚ«=ù	m¼G¿=e\í¥<\ÔE\n=U\Å<\í<\öA=39¼ù	m<?&=ù	m<¡=;¦;ù	m<\æ/a=$\Ô-¼$\Ô-¼Ýºµ<,\×|:é§»=\æ/a=:®9=e\í¥<$\Ô-<ù	m<ù	m<\ÍU\Õ<<\Ý;\\\Ó=$\Ô-<û=¡=;¦;\Ä\à)=:®9=Y\0 =e\í¥<oM¼$\Ô-¼*IY=,=\öA=:®9=Ýºµ<\à2=\Ä\à)=O\ë=nbQ=:®9=¸\ð\ô¼¡=»E#\å<ù	m¼\öA=_=¦»ù	m<ù	m<\äx=¦»U\Å<<Ý»\à2=û=','2025-05-21 07:18:12'),(9,1,_binary '7\Ï\ð¼qM=\Ã\à\Ä=\ËH]<I=\ö%=qM½:@C¼V¤=\Óý¼ª7)¼§\Æ\Ö<\Óý<=\ÇQ=It=\Z/¼[Ë=\ò;¶;Î¹¯<¹Z=\ö¬<\ÇQ=7\Ï\ð¼g=\ÇQ=S=\ËH]<_\ÂÉ¼}9½:@C<\Ò*;b3;[Qw¼Î¹¯<ª7)<\Óý<:@C<=\í\ë=\àú2½7\Ï\ð<LF=µ¢<\ò;¶»±Á=\Ò*;\ò;¶;Î¹¯<\äk=¾¼<b3;[Qw¼\ËH]<M\ê;\î½\äk==§\Æ\Ö<\Z/¼µ¢<M=}9=\ò;¶»:@C<V¤=Î¹¯<,p=[Qw<§\Æ\Ö<M\ê;{Ü·=M½\î½g=\Óý<}9=It=\ËH]<\ëÓ=g½¼x,=b3»\ò;¶;>±<\ò;¶»\ö%=DP:Î¹¯¼[Qw¼_\ÂÉ¼7\Ï\ð<P\ò=\äk=\å\Ñ=¼x,=\àú2=\ï\Ê\ã<\èb\Ë=WZ±=DP:3Øª=qM=_\ÂÉ¼DP:\î=b3»DPºLF=\ËH]<\ÇQ=[Ë=S½Ý`=:@C<\ËH]<P\ò=\ï\Ê\ã<\Óý¼7\Ï\ð<\î=,p½\ö¬<§\ÆÖ¼ý¡=\Óý<>±<M\ê;7\Ï\ð<DP:\Z/¼mz=\Z/¼ª7)¼\Z/<p@>_\ÂÉ¼7\Ï\ð<\èb\Ë=\î=\Ò*»M\ê»7\Ï\ð<M\ê;[Qw¼¾¼<LF=[Ë=§\Æ\Ö<It½\äk=¾¼<µ¢<M\ê;,p=[Qw<_\Â\É<,p½g=:@C<\ö¬¼¹Z=¾¼<\ò;¶»Mê»S=LF=7\Ï\ð<,p½£Ï=S=7\Ï\ð<\ö%½ª7)¼\ò;¶;¾¼¼\äk=M\ê»¾¼<\ï\Ê\ã<>±<\äk=b3;¹Z=\ö2ü=7\Ï\ð<[Qw<%m½(ÿ?½S=\ÇQ=LF=mz=}9=:@C¼}9½DP:\Z/<:@C¼¼x,=\Z/¼\Ò*»b3;Î¹¯<M=P\ò=P\ò½½\Ò*»\èb\Ë=S=µ=:@C<>±<Î¹¯<M\ê;,p=:@C¼S=[Qw<\äk=b3;It=\Óý<M\ê;tt=¼x,=mz=§\Æ\Ö<%m=¾¼<µ¢<¾¼<{Ü·=m=L¾>>±¼\ö%=\àú2=\Óý¼¾¼¼ª7)<ª7)¼[Ë=¼x,=(ÿ?=b3»\Ò*;qM½mz=M=\äk½Î¹¯<\ï\Ê\ã<}9=¼x,=_\Â\É<DP:\î=V¤=%m=µ¢¼ý¡=i´=£Ï½tt=ª7)<[Ë=§\Æ\Ö<I=\ËH]<\ËH]<\ï\Ê\ã<¼x,=\Óý<LF=S½µ¢<:@C¼\Ò*»\ò;¶»M=\Óý¼\ö¬<[Qw¼\ËH]<\ï\Ê\ã<¹Z=\ËH]<\ö%=§\ÆÖ¼\Ò*;Ý`=b3»\äk==M=It½§\Æ\Ö<,p=§\ÆÖ¼¾¼<\Óý<Ý`½µ¢<}9=mz=\î=\ÇQ=7\Ï\ð<\ö%=\ËH]<3Øª=(ÿ?=\Z/<b3;P\ò=,p=¾¼<§\Æ\Ö<\ö%=V¤=:@C<7\Ï\ð<M=M\ê»7\Ï\ð<(ÿ?½\ï\Ê\ã<tt=ý¡=m=qM=[Ë=[Ë=7\Ï\ð<M=>±<\Ò*»\ò;¶»DP:xk\å=\î=%m=Î¹¯¼M\ê»[Ë=[Qw<:@C¼mz=7\Ï\ð<ª7)<DPº>±<\ò;¶»\ò;¶;>±¼§\ÆÖ¼\Ò*»±Á=\äk=ª7)<[Qw<[Ë=ª7)¼ý¡=\ËH]¼(ÿ?=¾¼<¬\è=\Ö!\È=_\Â\É<¾¼¼£Ï=¼x,=(ÿ?=Mê»ª7)<Ý`=\ï\Ê\ã<µ¢<T\é\Þ=M=[Qw<}9=\ò;¶;g=LF½£Ï=V¤=¾¼<WZ±=\ö¬<M\ê;(ÿ?=,p=¼x,=^¾=7\Ï\ð¼\Z/¼(ÿ?=\ëÓ=M\ê;g=\Ò*;µ¢<P\ò=\ò;¶»Ù½E®=¼x,½b3»µ=\ËH]<%m=qM=»=\ï\Ê\ã¼P\ò½>±<\Z/¼7\Ï\ð<¼x,½mz={Ü·=\ö¬<mz=\äk=It=>±<7\Ï\ð¼I=\äk=\ò;¶»\Ò*»S½\ï\Ê\ã¼\ö¬¼:@C¼§\Æ\Ö<\Ã\à\Ä=b3;\ö¬<,p=_\ÂÉ¼£Ï=Î¹¯<LF=%m½\ö¬<M\ê;It=\Z/<_\ÂÉ¼LF=7\Ï\ð<¹Z=,p=qM=[Qw<µ¢<}9=\Óý¼b3;_\ÂÉ¼>±<\î=DP:¼x,=mz=qM=Î¹¯<:@C¼I=µ¢<7\Ï\ð<ª7)<\ï\Ê\ã<¾¼<S=:@C<ª7)<¼x,=ª7)<\ï\Ê\ã<tt=>±¼S=b3;g=}9=\Z/<\àú2==\ï\Ê\ã<ª7)<\ö%½[Ë=\ï\Ê\ã<,p½\èb\Ë=¼x,=\ò;¶»S=(ÿ?=\ö¬<\Ò*;\ËH]<§\Æ\Ö<\Ò*;qM=M\ê;','2025-05-20 06:56:27'),(10,1,_binary '\0×£<RI»r\âG= <f=H94=@Y½,`\å¼@Y=  =BÑ=\Ð=kz¥=\å\í\ë;@Y=\Õ-¼¸d*<ÀD\Ø<V	y<h\Z½ÿ<z\Âu=D¼V	y<ÀD\Ø<{\ò<\Õ-¼[={\ò<ÿ¼·Q:o»\0×£¼h\Z=§h=¯t=\å\í\ë;=,`å¼{ò¼D¼D¼D<3P|=GÁ¨=¹TA½¹TA=h\Z=o;,`\å¼l\ò°<«-½@Y=V	y<·Q:ù\æ=§h=  ½  =ÿ<3P|=,`\å<3P|=kz¥½ù\æ=ÀD\Ø<¯t=D<\áýT=Ö¥=3P|=¯t=\Õ-<,`\å<V	y< ¼C=h\Z=\0×£<o;·»¸d*¼\"¬=»¼ <¸d*<r\âG=3P|=f=»<D<·Q:\0×£¼»<@Y=\ée\÷=o»Rb= <o;ù\æ=¹TA=\Ý\r¾<²\ì=·Qºr\âG=¯t½o»²\ì={\ò<\å\í\ë;H94=Ä¬ú=®ü=  =@Y=¹TA=«-=o»·;,`\å<\Ý\r¾<¯t= <Rb=@Y=RI»ÀD\Ø<ÀD\Ø<·Qº\å\í\ë;\Ý\r¾<·;\å\í\ë»\Ù\'=kz¥=\Õ-¼o;\å\í\ë;3P|=V	y¼@Y=D¼\Õ-<h\Z=  =,`\å<»<\0×£¼ú^=f=\áýT=r\âG½ú^=h\Z==\áýT=»<Òµ=²\ì=·Üµ=C=s\Ò^<s\Ò^<RI;ÿ<\ön=  =\Ð=\Ý\r¾¼\áýT=»\Ì\Ì=\0×£<\å\í\ë»H94=¹TA=,`\å¼o»,`\å¼lò°¼¸d*<\Ù\'=\Õ-¼·Qº·»\Ç:=,`\å<z\Âu½»<V	y¼@Y=O)\Ë<V	y<\å\í\ë;@Y=+pN=²\ì=\Õ-¼o»¯t={\ò<ù\æ=\å\í\ë;ÿ<s\Ò^¼,`\å<[=Òµ=H94½l\ò°<  ½»¼¹TA=s\Ò^<o»Òµ=\ön=\Õ-<§h=¸d*<?\Æ=s\Ò^<V	y<Òµ=§h=3P|½\Ý\r¾<@Y=r\âG=  =·Qº®ü=\Ä4o=ù\æ=D¼\÷*>RI;RI;\Õ-¼s\Ò^<K±¿=z\Âu=?\Æ=®ü=ÿ<C=\å\í\ë;\Ý\r¾<¸d*<\Õ-¼RI»H94=@Y½ú^=D<s\Ò^<H94=z\Âu=§h=,`\å<\ön=l\ò°<{\ò<Rb=O)Ë¼ÀD\Ø<¸d*¼C=\Ä4o=«-=¯t=\å\í\ë»§h={\ò<·Q:¸d*<D<ù\æ½»<o»»<o»\å\í\ë;h\Z=RI»@Y=\0×£<O)\Ë<V	y¼§h½Òµ=\Ý\r¾¼Rb=ú^=[½3P|=,`\å<\Ý\r¾< ¼D¼\0×£<·»¸d*<·Qº¸d*<»<,`\å¼·Q:=H94=3¢=ú^=kz¥=  =»<»<\0×£<«-=ÿ<ù\æ½z\Âu=\å\í\ë»ÀD\Ø<\áýT½r\âG=\Ç:½,`\å<l\ò°< <§h=»¼kz¥=D¼l\ò°<,`\å<@Y=\Õ-¼²\ì=¸d*<²\ì= <o»,`å¼»<,`\å<?\Æ=ÿ<=H94½o;»¼«-=ÀD\Ø< <,`\å¼s\Ò^¼·»\0×£<z\Âu=¹TA½o;\"¬=\Ä4o=\Õ-¼ÀD\Ø<BÑ=\à\É=¯t=3P|=Ö¥=ÿ<,`\å<3P|=3P|=oj¼=ÿ¼\0×£<s\Ò^<·Q:§h=\0×£<+pN½Ä¬ú=l\ò°<¹TA=\Ù\'=«-½\Ù\'=RI»·Q:RI;¸d*¼·Üµ=+pN=ÿN¯=Ö¥=s\Ò^¼BÑ=Rb=\Õ-<C½ <h\Z=l\ò°<¯t=¯t=\ön=D¼\å\í\ë;[½{\ò<·Qº¯t=\Ý\r¾<·»3P|=ÀD\Ø<\ä>f=+pN=s\Ò^<«-=D<  =D¼Òµ=@Y=·Üµ=·Qº\0×£<H94=\Ç:=l\ò°<\Õ-¼H94=\áýT=+pN=Òµ=ú^=ÿ<¸d*<D¼tZ\Ó=RI;¯t=«-=»¼BÑ=\Øa!>¸d*<\áýT=,`\å<{\ò<\áýT=h\Z=¹TA=r\âG=o;D<V\í=¸d*<r\âG=Òµ=ÀD\Ø<ù\æ=\Ù\'=@Y=@Y=\Ý\r¾<»<\å\í\ë»o»\äu\à=s\Ò^<ù\æ½z\Âu½RI»RI»²\ì= <z\Âu= <{\ò<RI;\Ä4o=·Q:RI»¸d*<BÑ=l\ò°¼\Õ-<«-=¸d*<D<ÿ< <RI;h\Z½·»«-½\Ç:=«-=ÿ<·;ÿ¼·»ÿ<»¼RI;h\Z=z\Âu=«-=','2025-05-20 06:58:07'),(11,1,_binary '\õ\îd=±¢<_\ØV=\õ\îd=Z=\ãP=\ãP½ý;?úk=J*=\ë3=Æ£=\õ\îd=\Óz=<Å»¶A=\Ý0¾<5=<Å»£¤=W%=\n~=*T>_\ØV=D\Z°<\õ\îd=iø\Z¼W%=<\Å;¸RS<5=±¢<¡,=\ào<<\Å;iø\Z<=?úk=?úk=-\\	=µ=D\Z°<D\Z°<wg½\ÍO=\n~=\ËÁH=%7¼¶A=\Ý0¾<,\ö<ia:%7¼wg=Z=\n~=\ë3=¡,=¡,=ý;qG\Ì<µ=«\ã]=iø\Z<^\Ú<Àr=\ËÁH½\n~=t\è<¦\Óû=t\è<µ=¸RS<\ë3=D\Z°<\Ðá»\ËÁH=D\Z°¼tè¼tè¼µ½-\\	=%7<wg=\ào<þ=«\ã]=\í<Ö<±¢<4«:=\ë3=\ào<¡,=Z=_\ØV=_\ØV=);?úk=qG\Ì<ý;¶A=J*=Àr=¡,=iaº\ë3½¸RS<<\Å;Ö<5=\ào<W%=J*=D\Z°<\ë3=t\è<<\Å;)L§=\ë3=sW®=)»iaº±¢<Æ£=4«:=D\Z°<\n~=\ãP=);\Ý0¾¼\ËÁH=qGÌ¼\Ý0¾<\Ý0¾<ï¯=%7¼\í<%7<qG\Ì<W%=\n~=\õ\îd=Ö¼wg=qG\Ì<4«:=W%=4«:=?úk=4«:=^\Ú<¡,=þ=\ë3=W%=\ËÁH=\Ðá»wg=\í<\ãP½_\ØV=\ãP½-\\	=\ÍO=-\\	=,\ö<\ÎÑª=\ÍO==)»\õ\îd=\ËÁH=\ËÁH=\ë3=Àr½\ãP=±¢<<Å»øþ\Æ=^\Ú<s=t\è<þ=B\n\Î=¼bµ=¶A=\Óz½D\Z°¼\ào<¸RS¼«\ã]=ia:\õ\îd=ý;\n~=\ËÁH=wg=)»sW®=D\Z°<\ÎÑª=,\ö<Àr=\n~=D\Z°¼±¢<¡,=ý»8»=)»ï¯=¸RS¼\ë3=iø\Z¼\ÍO=wg=\Ð\á;8»=\Ý0¾<-\\	=n¼=Æ£=\Ý0¾<±¢<¶A=\ào<±¢<D\Z°¼«\ã]=W%=¸RS<ia:Ý±=¼bµ==%7<<\Å;);¸RS<^\Ú<\Ý0¾¼\ËÁH=ï¯=Ö<Àr=«\ã]=\í<ý;þ=\Ð\á;\ÍO=Àr½øþ\Æ=¡,=¸RS<%7<¸RS<s=\í<iaº<\Å;¸RS<Àr=t\è¼D\Z°<t\è<ý;Ö¼wg=D\Z°<qGÌ¼\Ðá»þ=-\\	=Àr=\ãP=ý;iaºiaº¸RS<wg=<\Å;4«:=«\ã]=_\ØV=4«:=Àr=\n~½\Ý0¾¼¸RS<\Ý0¾<Z=?úk=wg=wg=%7<\Óz½\Ðá»);\ào<);¶A=\ãP½4«:=%7<¶A=\ËÁH=ia:Ö<\ÍO=\õ\îd=Qy\Ã=<\Å;-\\	=\Ðá»\ë3½\ãP=¶A=B\n\Î=Ý±=%7¼qGÌ¼¡,=\Ý0¾<4«:=\n~=Ö<Ö<£¤=\ãP=Àr=¸RS¼Àr=ia:s=-\\	=\Ê=£¤=\ë3=±¢<4«:=\Ð\á;_\ØV=%7¼¡,=\ÍO=t\è<,\ö¼þ=\Ðá»wg=\ËÁH=\Ý0¾<\Ð\á;,\ö<í¼<Å»^Ú¼Àr½\n~=\Ý0¾¼¸RS<\ËÁH=^\Ú<\ç\Ñ=¶A½\í<±¢<qG\Ì<wg=\í<)»Ç±\æ=\Óz=D\Z°<-\\	=Àr=s=\n~=sW®=5=%7<\Óz=<\Å;8»=Àr=-\\	=t\è<þ=\Ðá»¸RS<sW®=<Å»\ào<\n~=t\è<¡,=,\ö<Ö<\ãP=_\ØV=¸RS<_\ØV=\ào<D\Z°<)»t\è<<\Å;<\Å;\n~=Ý±=Æ£=t\è<_\ØV=-\\	=%7¼\ËÁH=ï¯==%7<\õ\îd=^\Ú<,\ö<J*=\ë3½qG\Ì<\Ý0¾¼\Óz=t\è¼Ý±=4«:=\Óz=Ö<\Óz=);\Ð\á;D\Z°<\Ê=_\ØV=¸RS<4«:=±¢¼^Ú¼4«:½\n~===\õ\îd=¡,=t\è<±¢¼^\Ú<D\Z°<Z=ia:£¤=?úk==4«:=4«:=Àr=\ào¼\í<-\\	=\Ðá»\ËÁH=¸RS<¸RS¼\Óz=-\\	=t\è<Ö<\Ê=\í<\ãP=<\Å;\Ð\á;4«:=_\ØV=4«:=wg=\ào<qGÌ¼\õ\îd=4«:=«\ã]=\ãP=<\Å;¡,=\õ\îd½D\Z°<\Ðá»¶A=4«:=,\ö¼wg½Àr=\Ð\á;iø\Z¼_\ØV=«\ã]=Ö¼¶A=\í<<\Å;«\ã]=ý;þ=Z=\Ãz>\í<','2025-05-20 06:59:29');
/*!40000 ALTER TABLE `face_embedding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `origin_name` varchar(255) NOT NULL,
  `create_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` varchar(255) NOT NULL,
  `type` tinytext NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,'sign.png','2025-05-13 13:53:54','2025\\05\\13\\bbe1c25d-16fc-4ebf-aaa9-fc07b522c330.png','image/png'),(2,'ì¶ìì´ì¼ë¹¡.png','2025-05-19 05:50:24','2025/05/19/3a6e32aa-194f-4fe9-9dd7-3bf8d6b8c1f3.png','image/png'),(3,'ì¤í¬ë¦°ì· 2025-02-24 133852.png','2025-05-19 06:16:21','2025/05/19/c358acff-6cf6-4a20-84d1-001bd1d185df.png','image/png'),(4,'photo.png','2025-05-19 06:59:25','2025/05/19/8ea67920-8cd5-4081-a60b-9822ced9f5f2.png','image/png'),(5,'ì¶ìì´.jpg','2025-05-19 08:06:15','2025/05/19/9e38da9c-9674-47ee-bc89-b406c4b3c3a5.jpg','image/jpeg'),(6,'photo.png','2025-05-19 08:11:07','2025/05/19/a68d5ffe-cb55-4c91-8e63-0d7dde987922.png','image/png'),(7,'ì¶ìì´.jpg','2025-05-19 08:13:40','2025/05/19/1256933b-a684-4bcb-9f72-39fbd0e58e04.jpg','image/jpeg'),(8,'photo.png','2025-05-19 08:17:58','2025/05/19/bfeaae8f-5cb7-44db-bb87-1cd7647d251b.png','image/png'),(9,'photo.png','2025-05-19 08:18:22','2025/05/19/561e5630-b9d0-4006-8ed8-013658d0c34d.png','image/png'),(10,'photo.png','2025-05-19 08:32:27','2025/05/19/4dfd4b17-06cf-40c5-8989-44d41c6c0126.png','image/png'),(11,'photo.png','2025-05-19 08:41:46','2025/05/19/a8e54e6b-34fa-41cf-81c9-4cc68abc8b19.png','image/png'),(12,'photo.png','2025-05-20 12:21:59','2025/05/20/53fb8bb9-d65b-483a-84cb-509195be237f.png','image/png'),(13,'photo.png','2025-05-20 12:26:25','2025/05/20/6042107e-f3b4-4c6e-a130-9fe36f605ec2.png','image/png'),(14,'photo.png','2025-05-20 12:27:21','2025/05/20/d7b8bd00-dd63-4f7e-af0f-336cb93c9e79.png','image/png'),(15,'photo.png','2025-05-20 12:27:48','2025/05/20/fa41ec3d-a6dc-47f1-b5d2-f8e18dab4b8e.png','image/png'),(16,'photo.png','2025-05-20 12:28:04','2025/05/20/82b52d69-57dd-4122-aff0-f9ba0a119f88.png','image/png'),(17,'photo.png','2025-05-20 12:28:13','2025/05/20/eb858fc7-662b-4d35-a2a9-327f72ba2193.png','image/png'),(18,'photo.png','2025-05-20 12:28:26','2025/05/20/fd8e6f98-b65a-4a45-b11d-f9f0a15c9199.png','image/png'),(19,'photo.png','2025-05-20 12:48:51','2025/05/20/bacb9ddf-34ad-4a5d-8ea0-a8778dcc8e6a.png','image/png'),(20,'photo.png','2025-05-20 12:49:27','2025/05/20/d5a31490-0396-4dd8-b73f-d357723f0169.png','image/png'),(21,'photo.png','2025-05-20 13:11:34','2025/05/20/a157968b-0fc0-4004-8c26-5106e04ee784.png','image/png'),(22,'photo.png','2025-05-20 13:11:37','2025/05/20/275a5bec-f087-4585-8980-15ab713474f1.png','image/png'),(23,'photo.png','2025-05-20 13:54:05','2025/05/20/bdf4c7a6-00cd-4312-9316-a8e6fa1c9db1.png','image/png'),(24,'photo.png','2025-05-20 14:14:39','2025/05/20/8203bacb-e789-41dd-b609-96412b0a576c.png','image/png'),(25,'photo.png','2025-05-20 14:21:23','2025/05/20/7f5bc89e-f45f-41f8-8f39-565d96c3063c.png','image/png'),(26,'photo.png','2025-05-21 00:46:49','2025/05/21/1b3a6ecc-82b0-4f7b-a0a3-3af19f256be5.png','image/png'),(27,'2025-04-23-161805.jpg','2025-05-21 00:48:30','2025/05/21/947ff713-3069-49a7-92e7-276f575d429f.jpg','image/jpeg'),(28,'myface.png','2025-05-21 00:48:30','2025/05/21/7fe4d910-79d6-403c-badb-06f7e82f04b4.png','image/png'),(29,'ì©íì´í.jpg','2025-05-21 00:48:30','2025/05/21/fece1545-2d3c-425f-bcd1-4e36cc7c25c4.jpg','image/jpeg'),(30,'ì¹ì°ë.jpg','2025-05-21 00:48:30','2025/05/21/7274534b-0939-4332-81cc-8c12635cfdfb.jpg','image/jpeg'),(31,'image.png','2025-05-21 01:06:05','2025/05/21/26039331-b2f1-4fd4-8a0c-12071a30747d.png','image/png'),(32,'photo.png','2025-05-21 02:30:47','2025/05/21/7f7170af-54a1-4496-a079-d0a51cf7cdb8.png','image/png'),(33,'photo.png','2025-05-21 02:30:49','2025/05/21/12f5a925-3d86-4506-a1a2-b81520ef5c83.png','image/png'),(34,'photo.png','2025-05-21 02:30:55','2025/05/21/dbb7aa2f-1d5b-4aea-b0fa-a758e2efb714.png','image/png'),(35,'photo.png','2025-05-21 02:30:57','2025/05/21/2f68c8a8-3cf1-4c62-ab60-98690830ac17.png','image/png'),(36,'photo.png','2025-05-21 02:31:00','2025/05/21/b47d28f3-8b9a-4298-99c3-abf17c3e0a95.png','image/png'),(37,'photo.png','2025-05-21 02:31:02','2025/05/21/f03a9df4-e87b-4d43-afd1-08daa53b5944.png','image/png'),(38,'photo.png','2025-05-21 02:31:05','2025/05/21/dfbb5752-6078-4f56-9a9d-a6d0f44cd295.png','image/png'),(39,'photo.png','2025-05-21 02:38:07','2025/05/21/155338cd-c76e-48a0-8f77-43a734ac717c.png','image/png'),(40,'photo.png','2025-05-21 02:38:09','2025/05/21/80af62fc-83c0-412a-9814-197d9518fe73.png','image/png'),(41,'photo.png','2025-05-21 02:38:11','2025/05/21/e38c8a4d-e009-454c-84d4-68392409536f.png','image/png'),(42,'photo.png','2025-05-21 02:51:37','2025/05/21/de8fa526-3d33-4908-a265-f9dca72d9189.png','image/png'),(43,'photo.png','2025-05-21 02:52:04','2025/05/21/889507d0-5388-445e-95ee-3e26ca0fe7ce.png','image/png'),(44,'2025ë 5ì 21ì¼ ì¤ì  10_34_29.png','2025-05-21 04:33:10','2025/05/21/bf792d42-5a07-4bf8-8217-c2250fcea22f-0433.png','image/png'),(48,'photo.png','2025-05-21 04:58:17','2025/05/21/da2aba8d-623d-4ca6-921d-953aa7c733a3-0458.png','image/png'),(49,'photo.png','2025-05-21 04:58:20','2025/05/21/9e1f9f30-6929-463d-a528-02f68494f64f-0458.png','image/png'),(50,'photo.png','2025-05-21 04:58:22','2025/05/21/607372c9-27ee-4946-8aae-b722bcdeaa93-0458.png','image/png'),(51,'photo.png','2025-05-21 04:58:53','2025/05/21/73d67af0-acd1-481e-a6ab-eeea11e7d5b7-0458.png','image/png'),(52,'photo.png','2025-05-21 04:58:55','2025/05/21/d3f42bf1-7190-4e80-a4f9-8b2e9397da68-0458.png','image/png'),(53,'photo.png','2025-05-21 04:58:58','2025/05/21/b7370935-882f-41e5-aab7-d4c154068e91-0458.png','image/png'),(54,'photo.png','2025-05-21 05:02:56','2025/05/21/fc94489c-e275-4965-affa-b14075ce059e-0502.png','image/png'),(55,'photo.png','2025-05-21 05:03:00','2025/05/21/c7052d8e-cf5c-42a0-a5eb-479c144f02cf-0503.png','image/png'),(56,'photo.png','2025-05-21 05:03:08','2025/05/21/4df8c2bc-290c-43fd-8536-e13b2665ab61-0503.png','image/png'),(57,'photo.png','2025-05-21 05:03:26','2025/05/21/260690f0-3737-4f57-8ba6-45440cc4fc3f-0503.png','image/png'),(58,'photo.png','2025-05-21 05:03:30','2025/05/21/59dc8f4a-8609-4dae-ae07-b6be2e4629d2-0503.png','image/png'),(59,'photo.png','2025-05-21 05:03:35','2025/05/21/47f49c60-7b2e-4f46-b663-2c17d8b3ff8e-0503.png','image/png'),(60,'photo.png','2025-05-21 06:37:12','2025/05/21/f4899561-0976-48d5-b745-3387069ef739-0637.png','image/png'),(61,'photo.png','2025-05-21 06:37:24','2025/05/21/7261d4ae-108d-4bb3-b25b-5556ecf3bf68-0637.png','image/png'),(62,'photo.png','2025-05-21 06:37:28','2025/05/21/2ef228b3-b4d9-4612-b352-36922e8e2130-0637.png','image/png'),(63,'photo.png','2025-05-22 08:00:17','2025/05/22/ac2ffffe-014c-468b-9ac0-5a00a906155a-0800.png','image/png'),(64,'photo.png','2025-05-22 08:00:20','2025/05/22/5f0e7982-92fa-44ec-b41d-0075870ca8bc-0800.png','image/png');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `create_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notice_body` tinytext,
  `title` varchar(100) DEFAULT NULL,
  `important` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`notice_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notice_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `teacher` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (14,1,'2025-05-16 01:59:20','UR ì ì¹ìì ê°ììëë¤!','ìëíì­ëê¹. UR ì ì¹ì ìëë¤.',0),(15,1,'2025-05-16 02:02:04','ë´ìíì´ 05ì 29ì¼ì ìì ëì´ ììµëë¤.','2025ë ë´ìí ìë´',0),(16,1,'2025-05-16 02:02:42','05.18 ëì²´ ê³µí´ì¼ë¡ ì¸í´ í´ìí©ëë¤.','ëì²´ ê³µí´ì¼ì ë°ë¥¸ í´ì ìë´',0),(18,1,'2025-05-16 03:01:59','c203íì ë°íê° ìê² ìµëë¤.','250522 íë¶ëª¨ ì°¸ê´ ë°íí ìë´',0);
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent` (
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `parent_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
INSERT INTO `parent` VALUES (4),(5),(6);
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_child`
--

DROP TABLE IF EXISTS `parent_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_child` (
  `user_id` int NOT NULL,
  `child_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`child_id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `FKrfo40pgyce31tgs3e8qx7is1m` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `parent_child_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `parent` (`user_id`),
  CONSTRAINT `parent_child_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `child` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_child`
--

LOCK TABLES `parent_child` WRITE;
/*!40000 ALTER TABLE `parent_child` DISABLE KEYS */;
INSERT INTO `parent_child` VALUES (4,4),(4,6),(4,11);
/*!40000 ALTER TABLE `parent_child` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stuff`
--

DROP TABLE IF EXISTS `stuff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stuff` (
  `stuff_id` int NOT NULL AUTO_INCREMENT,
  `stuff_name` varchar(100) NOT NULL,
  PRIMARY KEY (`stuff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stuff`
--

LOCK TABLES `stuff` WRITE;
/*!40000 ALTER TABLE `stuff` DISABLE KEYS */;
INSERT INTO `stuff` VALUES (1,'backpack'),(2,'umbrella'),(6,''),(7,'umbrella_closed');
/*!40000 ALTER TABLE `stuff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `user_id` int NOT NULL,
  `classroom_id` int NOT NULL,
  `class_room_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `class_room_id` (`classroom_id`),
  CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `teacher_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`classroom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,1,0);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `login_id` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(50) NOT NULL,
  `contact` varchar(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `create_dttm` timestamp NOT NULL DEFAULT (now()),
  `delete_dttm` timestamp NULL DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_changed` int NOT NULL DEFAULT '0',
  `fcm_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'keh0885','$2b$12$xhjgRyxvUf8T7y2dHTxCT.IagWdMWG1ftUBDlGRUysIzonYT0AcCe','ê¹ìí','01099991111','TEACHER','2025-05-08 08:04:12',NULL,'string',0,'d_4Heb0XvSIgAH0eNB_NJ9:APA91bG8cEKTu2ncbEMndSIt_4VbuP6GR_70b-Z-4BAe8uIs0WHXCsh6Lxjn65r_sLwdvMCN1ot9NC3auos2KTi4VoW4j_XjmPye5VEzwQNTC5rry_AJy-I'),(4,'parent001','$2b$12$xhjgRyxvUf8T7y2dHTxCT.IagWdMWG1ftUBDlGRUysIzonYT0AcCe','ê¹ë¶ëª¨','01098765432','PARENT','2025-05-12 14:50:18',NULL,'parent@ssafy.com',0,'filYJkjm6IJufwBMsUa5mb:APA91bFdpAXbMFmnYeAegHhWXdUw3cn8-m1LJYHtHTNSq18efB36oJVirvB4PrHv4T2iL8JvxPq1OUx8ny6Ci7n6A-4tvWDVxOtYN56usEAwZsxsdMSUeTA'),(5,'parent002','$2b$12$xhjgRyxvUf8T7y2dHTxCT.IagWdMWG1ftUBDlGRUysIzonYT0AcCe','ìµìë¹ ','01098736472','PARENT','2025-05-20 04:35:35',NULL,'father@ssafy.com',0,NULL),(6,'parnet003','$2b$12$xhjgRyxvUf8T7y2dHTxCT.IagWdMWG1ftUBDlGRUysIzonYT0AcCe','ë°ìë§','01056738383','PARENT','2025-05-20 04:41:11',NULL,'mother@ssafy.com',0,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-22 10:20:26
