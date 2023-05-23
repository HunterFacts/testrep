ALTER TABLE Account
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Conclusion
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Employee
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE EmployeeOnWorkshift
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE House
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Loan
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE PenaltyOnShift
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Person
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Petition
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE ResettingTop
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Workplace
ADD actuality bit NOT NULL DEFAULT 1;

ALTER TABLE Workshift
ADD actuality bit NOT NULL DEFAULT 1;