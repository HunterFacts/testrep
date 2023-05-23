CREATE TABLE [Referral] (
   [id] uniqueidentifier,
   [receive] uniqueidentifier,
   [give] uniqueidentifier,
   PRIMARY KEY ([id])
  );

  alter table [Referral]
	add constraint FK_Referral_receive_To_Employee FOREIGN KEY ([receive])  REFERENCES [Employee] (id)

  alter table [Referral]
	add constraint FK_Referral_give_To_Employee FOREIGN KEY ([give])  REFERENCES [Employee] (id)
