CREATE TABLE [Referral] (
   [id] uniqueidentifier,
   [login] nvarchar(300),
   [date] datetime,
   [status] nvarchar(300),
   [ipadress] nvarchar(150),
   [device] nvarchar(300),
   [country] nvarchar(150),
   [digitaltrace] nvarchar(MAX),
   PRIMARY KEY ([id])
  );

  alter table [Referral]
	add constraint FK_Referral_receive_To_Employee FOREIGN KEY ([receive])  REFERENCES [Employee] (id)

  alter table [Referral]
	add constraint FK_Referral_give_To_Employee FOREIGN KEY ([give])  REFERENCES [Employee] (id)
