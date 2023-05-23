CREATE TABLE [RoomOnWorkshift] (
   [id] uniqueidentifier,
   [token] float,
   [workshift] uniqueidentifier,
   [room] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [RoomOnWorkshift]
	add constraint FK_RoomOnWorkshift_To_Workshift FOREIGN KEY ([workshift])  REFERENCES [Workshift] (id)
	alter table [RoomOnWorkshift]
	add constraint FK_RoomOnWorkshift_To_Room FOREIGN KEY ([room])  REFERENCES [Room] (id)