CREATE TABLE [Workshift] (
   [id] uniqueidentifier,
   [date] datetime,
   [timestart] datetime,
   [timeend] datetime,
   [token] float,
   [house] uniqueidentifier,
   [responsible] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Workshift]
	add constraint FK_Workshift_To_House FOREIGN KEY ([house])  REFERENCES [House] (id)
	alter table [Workshift]
	add constraint FK_Workshift_To_Employee FOREIGN KEY ([responsible])  REFERENCES [Employee] (id)