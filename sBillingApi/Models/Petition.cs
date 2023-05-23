using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Petition
    {
        public Petition()
        {
            AnswerPetition = new HashSet<AnswerPetition>();
        }

        public Guid Id { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public DateTime? Date { get; set; }
        public Guid? Workshift { get; set; }
        public Guid? Employee { get; set; }
        public string Status { get; set; }
        public bool? Actuality { get; set; }

        public virtual Employee EmployeeNavigation { get; set; }
        public virtual Workshift WorkshiftNavigation { get; set; }
        public virtual ICollection<AnswerPetition> AnswerPetition { get; set; }
    }
}
