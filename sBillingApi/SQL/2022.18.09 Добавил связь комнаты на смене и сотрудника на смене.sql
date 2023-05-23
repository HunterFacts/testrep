ALTER TABLE EmployeeOnWorkshift
ADD [roomOnWorkshift] uniqueidentifier NULL;

 alter table [EmployeeOnWorkshift]
	add constraint FK_EmployeeOnWorkshift_To_RoomOnWorkshift FOREIGN KEY ([roomOnWorkshift])  REFERENCES [RoomOnWorkshift] (id)