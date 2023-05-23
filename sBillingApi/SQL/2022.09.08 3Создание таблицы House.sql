CREATE TABLE [House] (
   [id] uniqueidentifier,
   [addressString] nvarchar(350),
   [houseNumber] nvarchar(15),
   [street] nvarchar(150),
   [city] nvarchar(150),
   [name] nvarchar(150),
   [workplace] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [House]
	add constraint FK_House_To_Workplace FOREIGN KEY ([workplace])  REFERENCES [Workplace] (id)