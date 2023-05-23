using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class TaranScrmContext : DbContext
    {
        public TaranScrmContext()
        {
        }

        public TaranScrmContext(DbContextOptions<TaranScrmContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Account> Account { get; set; }
        public virtual DbSet<Achievement> Achievement { get; set; }
        public virtual DbSet<AchievementOnEmployee> AchievementOnEmployee { get; set; }
        public virtual DbSet<AnswerPetition> AnswerPetition { get; set; }
        public virtual DbSet<Conclusion> Conclusion { get; set; }
        public virtual DbSet<Employee> Employee { get; set; }
        public virtual DbSet<EmployeeOnWorkshift> EmployeeOnWorkshift { get; set; }
        public virtual DbSet<HistoryAuth> HistoryAuth { get; set; }
        public virtual DbSet<House> House { get; set; }
        public virtual DbSet<Loan> Loan { get; set; }
        public virtual DbSet<PenaltyOnShift> PenaltyOnShift { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<Petition> Petition { get; set; }
        public virtual DbSet<Referral> Referral { get; set; }
        public virtual DbSet<ResettingTop> ResettingTop { get; set; }
        public virtual DbSet<Room> Room { get; set; }
        public virtual DbSet<RoomOnWorkshift> RoomOnWorkshift { get; set; }
        public virtual DbSet<Workplace> Workplace { get; set; }
        public virtual DbSet<Workshift> Workshift { get; set; }
        public virtual DbSet<WorkshiftType> WorkshiftType { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("data source=HYPECODER;initial catalog=TaranScrm;integrated security=True;MultipleActiveResultSets=True;App=EntityFramework;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150);

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.Account)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_Account_To_Employee");
            });

            modelBuilder.Entity<Achievement>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Image)
                    .HasColumnName("image")
                    .HasMaxLength(255);

                entity.Property(e => e.Message).HasColumnName("message");

                entity.Property(e => e.Name).HasColumnName("name");
            });

            modelBuilder.Entity<AchievementOnEmployee>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Achievement).HasColumnName("achievement");

                entity.Property(e => e.Active).HasColumnName("active");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.HasOne(d => d.AchievementNavigation)
                    .WithMany(p => p.AchievementOnEmployee)
                    .HasForeignKey(d => d.Achievement)
                    .HasConstraintName("FK_AchievementOnEmployee_To_Achievement");

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.AchievementOnEmployee)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_AchievementOnEmployee_To_Employee");
            });

            modelBuilder.Entity<AnswerPetition>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Message)
                    .HasColumnName("message")
                    .HasColumnType("text");

                entity.Property(e => e.Petition).HasColumnName("petition");

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.AnswerPetition)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_AnswerPetition_To_Employee");

                entity.HasOne(d => d.PetitionNavigation)
                    .WithMany(p => p.AnswerPetition)
                    .HasForeignKey(d => d.Petition)
                    .HasConstraintName("FK_AnswerPetition_To_Petition");
            });

            modelBuilder.Entity<Conclusion>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Age).HasColumnName("age");

                entity.Property(e => e.Datebirth)
                    .HasColumnName("datebirth")
                    .HasColumnType("datetime");

                entity.Property(e => e.Fio)
                    .HasColumnName("fio")
                    .HasMaxLength(350);

                entity.Property(e => e.House).HasColumnName("house");

                entity.Property(e => e.Phone)
                    .HasColumnName("phone")
                    .HasMaxLength(30);

                entity.Property(e => e.Procent).HasColumnName("procent");

                entity.Property(e => e.Studying).HasColumnName("studying");

                entity.Property(e => e.Telegram)
                    .HasColumnName("telegram")
                    .HasMaxLength(200);

                entity.Property(e => e.User).HasColumnName("user");

                entity.Property(e => e.Workplace).HasColumnName("workplace");

                entity.HasOne(d => d.HouseNavigation)
                    .WithMany(p => p.Employee)
                    .HasForeignKey(d => d.House)
                    .HasConstraintName("FK_Employee_To_House");

                entity.HasOne(d => d.UserNavigation)
                    .WithMany(p => p.Employee)
                    .HasForeignKey(d => d.User)
                    .HasConstraintName("FK_Employee_To_User");

                entity.HasOne(d => d.WorkplaceNavigation)
                    .WithMany(p => p.Employee)
                    .HasForeignKey(d => d.Workplace)
                    .HasConstraintName("FK_Employee_To_Workplace");
            });

            modelBuilder.Entity<EmployeeOnWorkshift>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Account).HasColumnName("account");

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Room).HasColumnName("room");

                entity.Property(e => e.RoomOnWorkshift).HasColumnName("roomOnWorkshift");

                entity.Property(e => e.Token).HasColumnName("token");

                entity.Property(e => e.Workshift).HasColumnName("workshift");

                entity.HasOne(d => d.AccountNavigation)
                    .WithMany(p => p.EmployeeOnWorkshift)
                    .HasForeignKey(d => d.Account)
                    .HasConstraintName("FK_EmployeeOnWorkshift_To_Account");

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.EmployeeOnWorkshift)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_EmployeeOnWorkshift_To_Employee");

                entity.HasOne(d => d.RoomOnWorkshiftNavigation)
                    .WithMany(p => p.EmployeeOnWorkshift)
                    .HasForeignKey(d => d.RoomOnWorkshift)
                    .HasConstraintName("FK_EmployeeOnWorkshift_To_RoomOnWorkshift");

                entity.HasOne(d => d.WorkshiftNavigation)
                    .WithMany(p => p.EmployeeOnWorkshift)
                    .HasForeignKey(d => d.Workshift)
                    .HasConstraintName("FK_EmployeeOnWorkshift_To_Workshift");
            });

            modelBuilder.Entity<HistoryAuth>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Country)
                    .HasColumnName("country")
                    .HasMaxLength(350);

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Device)
                    .HasColumnName("device")
                    .HasMaxLength(350);

                entity.Property(e => e.Digitaltrace)
                    .HasColumnName("digitaltrace")
                    .HasColumnType("text");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.IpAddress)
                    .HasColumnName("ipAddress")
                    .HasMaxLength(350);

                entity.Property(e => e.Login)
                    .HasColumnName("login")
                    .HasMaxLength(350);

                entity.Property(e => e.Reason)
                    .HasColumnName("reason")
                    .HasColumnType("text");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasMaxLength(350);

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.HistoryAuth)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_HistoryAuth_To_Employee");
            });

            modelBuilder.Entity<House>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.AddressString)
                    .HasColumnName("addressString")
                    .HasMaxLength(350);

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .HasMaxLength(150);

                entity.Property(e => e.HouseNumber)
                    .HasColumnName("houseNumber")
                    .HasMaxLength(15);

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150);

                entity.Property(e => e.Street)
                    .HasColumnName("street")
                    .HasMaxLength(150);

                entity.Property(e => e.Workplace).HasColumnName("workplace");

                entity.HasOne(d => d.WorkplaceNavigation)
                    .WithMany(p => p.House)
                    .HasForeignKey(d => d.Workplace)
                    .HasConstraintName("FK_House_To_Workplace");
            });

            modelBuilder.Entity<Loan>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Amount).HasColumnName("amount");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Reason)
                    .HasColumnName("reason")
                    .HasColumnType("text");

                entity.Property(e => e.Requisite)
                    .HasColumnName("requisite")
                    .HasMaxLength(350);

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.Loan)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_Loan_To_Employee");
            });

            modelBuilder.Entity<PenaltyOnShift>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Amount).HasColumnName("amount");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Reason)
                    .HasColumnName("reason")
                    .HasColumnType("text");

                entity.Property(e => e.Workshift).HasColumnName("workshift");

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.PenaltyOnShift)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_PenaltyOnShift_To_Employee");

                entity.HasOne(d => d.WorkshiftNavigation)
                    .WithMany(p => p.PenaltyOnShift)
                    .HasForeignKey(d => d.Workshift)
                    .HasConstraintName("FK_PenaltyOnShift_To_Workshift");
            });

            modelBuilder.Entity<Person>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Login)
                    .HasColumnName("login")
                    .HasMaxLength(150);

                entity.Property(e => e.Password)
                    .HasColumnName("password")
                    .HasMaxLength(150);

                entity.Property(e => e.Role)
                    .HasColumnName("role")
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<Petition>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Employee).HasColumnName("employee");

                entity.Property(e => e.Message)
                    .HasColumnName("message")
                    .HasColumnType("text");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasMaxLength(30);

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasMaxLength(150);

                entity.Property(e => e.Workshift).HasColumnName("workshift");

                entity.HasOne(d => d.EmployeeNavigation)
                    .WithMany(p => p.Petition)
                    .HasForeignKey(d => d.Employee)
                    .HasConstraintName("FK_Petition_To_Employee");

                entity.HasOne(d => d.WorkshiftNavigation)
                    .WithMany(p => p.Petition)
                    .HasForeignKey(d => d.Workshift)
                    .HasConstraintName("FK_Petition_To_Workshift");
            });

            modelBuilder.Entity<Referral>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Give).HasColumnName("give");

                entity.Property(e => e.Receive).HasColumnName("receive");

                entity.HasOne(d => d.GiveNavigation)
                    .WithMany(p => p.ReferralGiveNavigation)
                    .HasForeignKey(d => d.Give)
                    .HasConstraintName("FK_Referral_give_To_Employee");

                entity.HasOne(d => d.ReceiveNavigation)
                    .WithMany(p => p.ReferralReceiveNavigation)
                    .HasForeignKey(d => d.Receive)
                    .HasConstraintName("FK_Referral_receive_To_Employee");
            });

            modelBuilder.Entity<ResettingTop>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.House).HasColumnName("house");

                entity.Property(e => e.NumberRoom).HasColumnName("numberRoom");

                entity.HasOne(d => d.HouseNavigation)
                    .WithMany(p => p.Room)
                    .HasForeignKey(d => d.House)
                    .HasConstraintName("FK_Room_To_House");
            });

            modelBuilder.Entity<RoomOnWorkshift>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Room).HasColumnName("room");

                entity.Property(e => e.Token).HasColumnName("token");

                entity.Property(e => e.Workshift).HasColumnName("workshift");

                entity.HasOne(d => d.RoomNavigation)
                    .WithMany(p => p.RoomOnWorkshift)
                    .HasForeignKey(d => d.Room)
                    .HasConstraintName("FK_RoomOnWorkshift_To_Room");

                entity.HasOne(d => d.WorkshiftNavigation)
                    .WithMany(p => p.RoomOnWorkshift)
                    .HasForeignKey(d => d.Workshift)
                    .HasConstraintName("FK_RoomOnWorkshift_To_Workshift");
            });

            modelBuilder.Entity<Workplace>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.MainWorkplace).HasColumnName("mainWorkplace");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150);

                entity.HasOne(d => d.MainWorkplaceNavigation)
                    .WithMany(p => p.InverseMainWorkplaceNavigation)
                    .HasForeignKey(d => d.MainWorkplace)
                    .HasConstraintName("FK_Workplace_To_Workplace");
            });

            modelBuilder.Entity<Workshift>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actuality)
                    .IsRequired()
                    .HasColumnName("actuality")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("datetime");

                entity.Property(e => e.House).HasColumnName("house");

                entity.Property(e => e.Isfull)
                    .IsRequired()
                    .HasColumnName("isfull")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Responsible).HasColumnName("responsible");

                entity.Property(e => e.Timeend)
                    .HasColumnName("timeend")
                    .HasColumnType("datetime");

                entity.Property(e => e.Timestart)
                    .HasColumnName("timestart")
                    .HasColumnType("datetime");

                entity.Property(e => e.Token).HasColumnName("token");

                entity.Property(e => e.Wtype).HasColumnName("wtype");

                entity.HasOne(d => d.HouseNavigation)
                    .WithMany(p => p.Workshift)
                    .HasForeignKey(d => d.House)
                    .HasConstraintName("FK_Workshift_To_House");

                entity.HasOne(d => d.WtypeNavigation)
                    .WithMany(p => p.Workshift)
                    .HasForeignKey(d => d.Wtype)
                    .HasConstraintName("FK_Workshift_To_WorkshiftType");
            });

            modelBuilder.Entity<WorkshiftType>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.House).HasColumnName("house");

                entity.Property(e => e.Position).HasColumnName("position");

                entity.Property(e => e.Shiftchange)
                    .HasColumnName("shiftchange")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Timeend).HasColumnName("timeend");

                entity.Property(e => e.Timename)
                    .HasColumnName("timename")
                    .HasMaxLength(255);

                entity.Property(e => e.Timestart).HasColumnName("timestart");

                entity.HasOne(d => d.HouseNavigation)
                    .WithMany(p => p.WorkshiftType)
                    .HasForeignKey(d => d.House)
                    .HasConstraintName("FK_WorkshiftType_To_House");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
