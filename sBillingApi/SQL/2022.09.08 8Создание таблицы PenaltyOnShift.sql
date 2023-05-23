CREATE TABLE [PenaltyOnShift] (
   [id] uniqueidentifier,
   [reason] text,
   [amount] float,
   [employee] uniqueidentifier,
   [workshift] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [PenaltyOnShift]
	add constraint FK_PenaltyOnShift_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)
	alter table [PenaltyOnShift]
	add constraint FK_PenaltyOnShift_To_Workshift FOREIGN KEY ([workshift])  REFERENCES [Workshift] (id)