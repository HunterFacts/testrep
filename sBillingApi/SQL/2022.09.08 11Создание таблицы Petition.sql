CREATE TABLE [Petition] (
   [id] uniqueidentifier,
   [type] nvarchar(150),
   [message] text,
   [date] datetime,
   [workshift] uniqueidentifier,
   [employee] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Petition]
	add constraint FK_Petition_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)
	alter table [Petition]
	add constraint FK_Petition_To_Workshift FOREIGN KEY ([workshift])  REFERENCES [Workshift] (id)