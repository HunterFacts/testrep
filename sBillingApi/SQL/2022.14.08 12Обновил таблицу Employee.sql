alter table [Employee] ADD [house] uniqueidentifier;
alter table [Employee] add constraint FK_Employee_To_House FOREIGN KEY ([house])  REFERENCES [House] (id)