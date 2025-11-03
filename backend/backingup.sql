USE task_manager;

DELIMITER $$

CREATE TRIGGER before_user_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN  
    INSERT INTO deleted_users_backup(id,username,password)
    VALUES (OLD.id,OLD.username,OLD.password);
END$$

CREATE TRIGGER before_team_delete
BEFORE DELETE ON teams
FOR EACH ROW
BEGIN
    INSERT INTO deleted_teams_backup(id,name)
    VALUES (OLD.id, OLD.name);
END $$