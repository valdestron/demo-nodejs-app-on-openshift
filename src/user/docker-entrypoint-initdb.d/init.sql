CREATE DATABASE IF NOT EXISTS `users` COLLATE 'utf8_general_ci' ;
CREATE DATABASE IF NOT EXISTS `users_unit_test` COLLATE 'utf8_general_ci' ;
GRANT ALL ON `users`.* TO 'root' ;
GRANT ALL ON `users_unit_test`.* TO 'root' ;
