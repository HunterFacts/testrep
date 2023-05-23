CREATE TABLE [Account] (
   [id] uniqueidentifier,
   [name] nvarchar(150),
   [employee] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Account]
	add constraint FK_Account_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)