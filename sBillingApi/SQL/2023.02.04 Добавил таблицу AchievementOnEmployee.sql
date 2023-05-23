CREATE TABLE [AchievementOnEmployee] (
   [id] uniqueidentifier,
   [achievement] uniqueidentifier,
   [employee] uniqueidentifier,
   [active] bit,
   [date] datetime,
   PRIMARY KEY ([id]),
  );

  alter table [AchievementOnEmployee]
	add constraint FK_AchievementOnEmployee_To_Achievement FOREIGN KEY ([achievement])  REFERENCES [Achievement] (id)
  alter table [AchievementOnEmployee]
	add constraint FK_AchievementOnEmployee_To_Employee FOREIGN KEY ([employee])  REFERENCES [Employee] (id)