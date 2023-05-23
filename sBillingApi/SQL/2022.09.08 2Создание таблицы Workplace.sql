CREATE TABLE [Workplace] (
   [id] uniqueidentifier,
   [name] nvarchar(150),
   [mainWorkplace] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Workplace]
	add constraint FK_Workplace_To_Workplace FOREIGN KEY ([mainWorkplace])  REFERENCES [Workplace] (id)