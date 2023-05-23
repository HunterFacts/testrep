CREATE TABLE [HistoryAuth] (
   [id] uniqueidentifier,
   [employee] uniqueidentifier,
   [login] nvarchar(350),
   [date] datetime,
   [status] nvarchar(350),
   [ipAddress] nvarchar(350),
   [device] nvarchar(350),
   [country] nvarchar(350),
   [digitaltrace] text,
   [reason] text,
   PRIMARY KEY ([id]),
  );

  alter table [HistoryAuth]
	add constraint FK_HistoryAuth_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)