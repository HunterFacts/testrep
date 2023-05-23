CREATE TABLE [EmployeeOnWorkshift] (
   [id] uniqueidentifier,
   [token] float,
   [room] int,
   [workshift] uniqueidentifier,
   [employee] uniqueidentifier,
   [account] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [EmployeeOnWorkshift]
	add constraint FK_EmployeeOnWorkshift_To_Workshift FOREIGN KEY ([workshift])  REFERENCES [Workshift] (id)
	alter table [EmployeeOnWorkshift]
	add constraint FK_EmployeeOnWorkshift_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)
	alter table [EmployeeOnWorkshift]
	add constraint FK_EmployeeOnWorkshift_To_Account FOREIGN KEY ([account])  REFERENCES [Account] (id)