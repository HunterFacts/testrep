CREATE TABLE [Room] (
   [id] uniqueidentifier,
   [numberRoom] int,
   [house] uniqueidentifier,
   PRIMARY KEY ([id]),
  );

  alter table [Room]
	add constraint FK_Room_To_House FOREIGN KEY ([house])  REFERENCES [House] (id)