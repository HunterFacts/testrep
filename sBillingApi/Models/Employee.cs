using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Employee
    {
        public Employee()
        {
            Account = new HashSet<Account>();
            AchievementOnEmployee = new HashSet<AchievementOnEmployee>();
            AnswerPetition = new HashSet<AnswerPetition>();
            EmployeeOnWorkshift = new HashSet<EmployeeOnWorkshift>();
            HistoryAuth = new HashSet<HistoryAuth>();
            Loan = new HashSet<Loan>();
            PenaltyOnShift = new HashSet<PenaltyOnShift>();
            Petition = new HashSet<Petition>();
            ReferralGiveNavigation = new HashSet<Referral>();
            ReferralReceiveNavigation = new HashSet<Referral>();
        }

        public Guid Id { get; set; }
        public string Fio { get; set; }
        public int? Age { get; set; }
        public string Phone { get; set; }
        public DateTime? Datebirth { get; set; }
        public string Telegram { get; set; }
        public Guid? User { get; set; }
        public Guid? Workplace { get; set; }
        public Guid? House { get; set; }
        public bool? Actuality { get; set; }
        public bool Studying { get; set; }
        public int? Procent { get; set; }

        public virtual House HouseNavigation { get; set; }
        public virtual Person UserNavigation { get; set; }
        public virtual Workplace WorkplaceNavigation { get; set; }
        public virtual ICollection<Account> Account { get; set; }
        public virtual ICollection<AchievementOnEmployee> AchievementOnEmployee { get; set; }
        public virtual ICollection<AnswerPetition> AnswerPetition { get; set; }
        public virtual ICollection<EmployeeOnWorkshift> EmployeeOnWorkshift { get; set; }
        public virtual ICollection<HistoryAuth> HistoryAuth { get; set; }
        public virtual ICollection<Loan> Loan { get; set; }
        public virtual ICollection<PenaltyOnShift> PenaltyOnShift { get; set; }
        public virtual ICollection<Petition> Petition { get; set; }
        public virtual ICollection<Referral> ReferralGiveNavigation { get; set; }
        public virtual ICollection<Referral> ReferralReceiveNavigation { get; set; }
    }
}
