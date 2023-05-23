CREATE TABLE [Employee] (
   [id] uniqueidentifier,
   [fio] nvarchar(350),
   [age] int,
   [phone] nvarchar(30),
   [datebirth] datetime,
   [telegram] nvarchar(200),
   [user] uniqueidentifier,
   [workplace] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Employee]
	add constraint FK_Employee_To_User FOREIGN KEY ([user])  REFERENCES [Person] (id)
	alter table [Employee]
	add constraint FK_Employee_To_Workplace FOREIGN KEY ([workplace])  REFERENCES [Workplace] (id)