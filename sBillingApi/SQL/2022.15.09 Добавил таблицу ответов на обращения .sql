CREATE TABLE [AnswerPetition] (
   [id] uniqueidentifier,
   [message] text,
   [date] datetime,
   [petition] uniqueidentifier,
   [employee] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [AnswerPetition]
	add constraint FK_AnswerPetition_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)
	alter table [AnswerPetition]
	add constraint FK_AnswerPetition_To_Petition FOREIGN KEY ([petition])  REFERENCES [Petition] (id)