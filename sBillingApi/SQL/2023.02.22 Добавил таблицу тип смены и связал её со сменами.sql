CREATE TABLE [WorkshiftType] (
   [id] uniqueidentifier,
   [timestart] time,
   [timeend] time,
   [timename] nvarchar(255),
   PRIMARY KEY ([id])
  );

  ALTER TABLE [Workshift] ADD [wtype] uniqueidentifier;

  alter table [Workshift]
	add constraint FK_Workshift_To_WorkshiftType FOREIGN KEY ([wtype])  REFERENCES [WorkshiftType] (id)

ALTER TABLE [WorkshiftType] ADD [house] uniqueidentifier;

alter table [WorkshiftType]
	add constraint FK_WorkshiftType_To_House FOREIGN KEY ([house])  REFERENCES [House] (id)

ALTER TABLE [WorkshiftType] ADD [position] int not null default 0;
ALTER TABLE [WorkshiftType] ADD [shiftchange] bit default 0;