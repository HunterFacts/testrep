CREATE TABLE [Loan] (
   [id] uniqueidentifier,
   [amount] float,
   [date] datetime,
   [status] nvarchar(350),
   [reason] text,
   [receivingOption] nvarchar(350),
   [requisite] nvarchar(350),
   [employee] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Loan]
	add constraint FK_Loan_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)