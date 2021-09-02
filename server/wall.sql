/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : wall

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 02/09/2021 17:16:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `id` int(0) NOT NULL,
  `message` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `likes` int(0) NULL DEFAULT NULL,
  `dislikes` int(0) NULL DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tags
-- ----------------------------
INSERT INTO `tags` VALUES (1, 'fgdsfdfsf', 6, 1, '游客');
INSERT INTO `tags` VALUES (3, '感到翻跟斗翻跟斗翻跟斗翻跟斗', 4, 0, '游客');
INSERT INTO `tags` VALUES (5, '羊肉汤羊肉汤羊肉汤有人', 7, 3, '游客');
INSERT INTO `tags` VALUES (16, 'fsdfsdsfsf', 1, 0, 'weIl');
INSERT INTO `tags` VALUES (17, 'fdsfdsfsdds', 5, 0, 'weIl');
INSERT INTO `tags` VALUES (18, 'gfdgdffdg', 17, 12, 'weIl');
INSERT INTO `tags` VALUES (26, 'dadasdad', 1, 0, 'weIl');
INSERT INTO `tags` VALUES (27, 'jjj', 6, 0, 'weIl');
INSERT INTO `tags` VALUES (28, '考虑考虑', 0, 0, 'weIl');

SET FOREIGN_KEY_CHECKS = 1;
